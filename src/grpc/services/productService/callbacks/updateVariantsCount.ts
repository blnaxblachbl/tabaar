import {
  handleUnaryCall,
  status,
  type ServerErrorResponse,
  type StatusObject,
} from "@grpc/grpc-js";
import { estypes } from "@elastic/elasticsearch";
import type z from "zod";

import { UpdateVariantsCountRequest } from "#grpc/generated/UpdateVariantsCountRequest";
import { UpdateVariantsCountResponse } from "#grpc/generated/UpdateVariantsCountResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { updateVariantsCountSchema } from "#utils/zod-schemas/products";
import { elasticSearch } from "#utils/elastic";
import { VariantIndex, ProductIndex } from "#utils/elastic/types";
import { INDEXES } from "#utils/elastic/types";

type Data = z.infer<typeof updateVariantsCountSchema>;

export type ToUpdate = {
  id: string;
  variants: VariantIndex[];
  seq_no: number;
  primary_term: number;
};

export const updateVariantsCount: handleUnaryCall<
  UpdateVariantsCountRequest,
  UpdateVariantsCountResponse
> = async (call, callback) => {
  const {
    success: apiKeySuccess,
    error: apiKeyError,
    code,
  } = await getApiKeyFromGrpc(call.metadata);

  const metaRetryCount = call.metadata.get("retryCount");
  let retryCount = metaRetryCount ? Number(metaRetryCount) : 0;

  if (!apiKeySuccess) {
    callback({
      code,
      details: apiKeyError ?? "Something went wrong",
    });
    return;
  }

  const { success, data, error } = updateVariantsCountSchema.safeParse(
    call.request.data,
  );

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0]?.message,
    });
    return;
  }
  const { response, error: updateError } = await updateCounts(data);

  callback(updateError, response);
};

async function updateCounts(
  data: Data,
  retryCount: number = 0,
): Promise<{
  error: Partial<StatusObject> | ServerErrorResponse | null;
  response?: UpdateVariantsCountResponse | null | undefined;
}> {
  const products: Record<string, typeof data> = data!.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = [item];
    } else {
      acc[item.id].push(item);
    }
    return acc;
  }, {});

  const toUpdate: ToUpdate[] = [];

  const poductsResult = await elasticSearch.mget<ProductIndex>({
    index: INDEXES.PRODUCTS,
    ids: Object.keys(products),
    _source: true,
  });

  for (const product of poductsResult.docs as estypes.GetGetResult<ProductIndex>[]) {
    if (
      "error" in product ||
      !product.found ||
      product._source?.deleted ||
      !product._seq_no ||
      !product._primary_term
    ) {
      return {
        error: {
          code: status.NOT_FOUND,
          message: `Products with ID- ${product._id} not found`,
        },
      };
    }

    const prevVariants = product._source?.variants ?? [];
    const nextProduct: ToUpdate = {
      id: product._id,
      variants: [],
      seq_no: product._seq_no,
      primary_term: product._primary_term,
    };

    for (const { value, variantId } of products[product._id]) {
      const index = prevVariants.findIndex((pV) => pV.id === variantId);
      if (index < 0) {
        return {
          error: {
            code: status.INVALID_ARGUMENT,
            message: `Variant with id - ${variantId} not found in Product with id - ${product._id}`,
          },
        };
      }
      const prevVariant = prevVariants[index];
      const nextCount = prevVariant.count + value;
      if (nextCount < 0) {
        return {
          error: {
            code: status.OUT_OF_RANGE,
            message: `Variant with ID - ${prevVariant.id} out of stock, max count is ${prevVariant.count}`,
          },
        };
      }
      prevVariants[index].count = nextCount;
    }

    nextProduct.variants = prevVariants;

    toUpdate.push(nextProduct);
  }

  const operations = toUpdate.flatMap((item, index) => [
    {
      update: {
        _index: INDEXES.PRODUCTS,
        _id: item.id,
        // if_seq_no: index === 0 ? item.seq_no : 1,
        // if_primary_term: index === 0 ? item.primary_term : 1,
        if_seq_no: item.seq_no,
        if_primary_term: item.primary_term,
      },
    },
    { doc: { variants: item.variants } },
  ]);
  const bulkResponse = await elasticSearch.bulk<
    ProductIndex,
    Partial<ProductIndex>
  >({
    refresh: true,
    operations,
    _source: true,
  });
  const conflict: typeof data = [];
  const result: UpdateVariantsCountResponse["data"] = [];
  for (const item of bulkResponse.items) {
    const dataItems = data.filter((d) => d.id === item.update?._id);
    if (dataItems.length === 0) {
      continue;
    }

    if (item.update?.error) {
      if (item.update.status === 409) {
        conflict.push(...dataItems);
        continue;
      } else {
        result.push(
          ...dataItems.map((dItem) => ({
            ...dItem,
            status: "error",
            error: item.update?.error?.reason ?? "Unknown error",
          })),
        );
      }
    } else {
      result.push(
        ...dataItems.map((dItem) => ({
          ...dItem,
          status: "success",
        })),
      );
    }
  }
  if (conflict.length > 0) {
    if (retryCount > 2) {
      return {
        error: null,
        response: {
          data: [
            ...result,
            ...conflict.map((c) => ({
              ...c,
              status: "error",
              error: "Update conflict",
            })),
          ],
        },
      };
    }

    const { error, response } = await updateCounts(conflict, retryCount + 1);

    if (error) {
      return {
        error,
      };
    }

    return {
      error: null,
      response: {
        data: [...result, ...(response?.data ?? [])],
      },
    };
  }
  return {
    error: null,
    response: { data: result },
  };
}
