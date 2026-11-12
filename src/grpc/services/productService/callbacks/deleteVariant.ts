import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { UpdateVariantRequest } from "#grpc/generated/UpdateVariantRequest";
import { UpdateVariantResponse } from "#grpc/generated/UpdateVariantResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";
import { deleteFolder } from "#utils/minio/deleteFolder";

const schema = z.object({
  id: z.string("Product Id is required"),
  variantId: z.string("Variant Id is required"),
});

export const deleteVariant: handleUnaryCall<
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

  const { success, data, error } = schema.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error?.issues[0]?.message,
    });
    return;
  }

  const { id, variantId } = data;

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
    if (!exist._source?.variants.some((v) => v.id === variantId)) {
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
        source: "ctx._source.variants.removeIf(v -> v.id == params.variantId)",
        lang: "painless",
        params: {
          variantId,
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
        details: "Failed to delete variant",
      });
      return;
    }
    deleteFolder(`${id}/${variantId}`);
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
