import { handleUnaryCall, status } from "@grpc/grpc-js";
import { errors } from "@elastic/elasticsearch";

import { CreateProductRequest } from "#grpc/generated/CreateProductRequest";
import { DeleteProductResponse } from "#grpc/generated/DeleteProductResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { elasticSearch } from "#utils/elastic";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

export const deleteProduct: handleUnaryCall<
  CreateProductRequest,
  DeleteProductResponse
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
  const { success, error, data } = stringIdInParams.safeParse(call.request);
  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error?.issues[0]?.message ?? "Invalid request",
    });
    return;
  }
  try {
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id: data.id,
      index: INDEXES.PRODUCTS,
      doc: { deleted: true },
      _source: {
        exclude: "deleted",
      },
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      callback({
        code: status.INTERNAL,
        details: "Failed to delete product",
      });
      return;
    }
    callback(null, {
      product: createGrpcProduct(parseSource(result.get._source)),
    });
  } catch (e) {
    console.error(e);
    if (e instanceof errors.ResponseError) {
      if (e.meta?.statusCode === 404) {
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
    return;
  }
};
