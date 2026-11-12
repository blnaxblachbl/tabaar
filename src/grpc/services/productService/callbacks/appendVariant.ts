import { handleUnaryCall, status } from "@grpc/grpc-js";
import { createId } from "@paralleldrive/cuid2";
import z from "zod";
import { errors } from "@elastic/elasticsearch";

import { AppendVariantRequest } from "#grpc/generated/AppendVariantRequest";
import { AppendVariantResponse } from "#grpc/generated/AppendVariantResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { appendVariantSchema } from "#utils/zod-schemas/products";
import { parseStruct } from "#utils/grpc/google";
import { INDEXES, ProductIndex, VariantIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

const schema = z.object({
  id: z.string("Product Id is required"),
  data: appendVariantSchema,
});

export const appendVariant: handleUnaryCall<
  AppendVariantRequest,
  AppendVariantResponse
> = async (call, callback) => {
  const {
    success: apiKeySuccess,
    error: apiKeyError,
    code,
  } = await getApiKeyFromGrpc(call.metadata);

  if (!apiKeySuccess) {
    callback({
      code,
      details: apiKeyError ?? "Something went wrong",
    });
    return;
  }

  const { success, error, data } = schema.safeParse({
    ...call.request,
    data: {
      ...call.request.data,
      characterstics: parseStruct(call.request.data?.characterstics ?? {}),
    },
  });

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error?.issues[0]?.message,
    });
    return;
  }
  const { id: productId, data: variantData } = data;
  const id = createId();

  const variant: VariantIndex = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false,
    images: [],
    ...variantData,
  };
  try {
    const exist = await elasticSearch.get<ProductIndex>({
      id: productId,
      index: INDEXES.PRODUCTS,
    });
    if (!exist.found || exist._source?.deleted) {
      return callback({
        code: status.NOT_FOUND,
        details: "Product not found",
      });
    }
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id: productId,
      index: INDEXES.PRODUCTS,
      script: {
        source: "ctx._source.variants.add(params.variant)",
        lang: "painless",
        params: {
          variant,
        },
      },
      _source: {
        exclude: "deleted",
      },
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      callback({
        code: status.FAILED_PRECONDITION,
        details: "Failed to create variant",
      });
      return;
    }
    const { minPrice, maxPrice, available, ...product } = parseSource(
      result.get._source,
    );
    callback(null, {
      product: {
        ...createGrpcProduct(product),
        minPrice: minPrice,
        maxPrice: maxPrice,
        available,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof errors.ResponseError) {
      if (error.meta.statusCode === 404) {
        return callback({
          code: status.NOT_FOUND,
          details: "Product not found",
        });
      }
    }
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
  }
};
