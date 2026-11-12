import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { UpdateVariantRequest } from "#grpc/generated/UpdateVariantRequest";
import { UpdateVariantResponse } from "#grpc/generated/UpdateVariantResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { updateVariantSchema } from "#utils/zod-schemas/products";
import { parseStruct } from "#utils/grpc/google";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

const schema = z.object({
  id: z.string("Product Id is required"),
  data: z.intersection(
    z.object({ id: z.string("Variant Id is required") }),
    updateVariantSchema,
  ),
});

export const updateVariant: handleUnaryCall<
  UpdateVariantRequest,
  UpdateVariantResponse
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

  const { success, data, error } = schema.safeParse({
    ...call.request,
    data: {
      ...call.request.data,
      characterstics: call.request.data?.characterstics
        ? parseStruct(call.request.data?.characterstics)
        : undefined,
    },
  });

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0]?.message,
    });
    return;
  }
  const { id, data: variantData } = data;

  try {
    const exist = await elasticSearch.get<ProductIndex>({
      id,
      index: INDEXES.PRODUCTS,
    });
    if (!exist.found || exist._source?.deleted) {
      return callback({
        code: status.NOT_FOUND,
        details: "Product not found",
      });
    }
    if (!exist._source?.variants.some((v) => v.id === variantData.id)) {
      return callback({
        code: status.NOT_FOUND,
        details: "Variant not found",
      });
    }
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      script: {
        source:
          "for (variant in ctx._source.variants) { if (variant.id == params.id) { variant.putAll(params.data) }}",
        lang: "painless",
        params: {
          id: variantData.id,
          data: variantData,
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
        details: "Failed to update variant",
      });
      return;
    }
    callback(null, {
      product: createGrpcProduct(parseSource(result.get._source)),
    });
  } catch (e) {
    console.error(e);
    if (e.meta?.statusCode === 404) {
      return callback({
        code: status.NOT_FOUND,
        details: "Product not found",
      });
    }
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
    return;
  }
};
