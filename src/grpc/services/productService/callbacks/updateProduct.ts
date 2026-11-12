import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { UpdateProductRequest } from "#grpc/generated/UpdateProductRequest";
import { UpdateProductResponse } from "#grpc/generated/UpdateProductResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { updateProductSchema } from "#utils/zod-schemas/products";
import { createGrpcProduct, parseGrpcProduct } from "#utils/grpc/product";
import { parseSource } from "#utils/elastic/functions";
import { elasticSearch } from "#utils/elastic";
import { INDEXES } from "#utils/elastic/types";
import { ProductIndex } from "#utils/elastic/types";

const updateSchema = z.object({
  id: z.string("Product ID is required"),
  data: updateProductSchema,
});

export const updateProduct: handleUnaryCall<
  UpdateProductRequest,
  UpdateProductResponse
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

  const {
    data: parseData,
    success,
    error,
  } = updateSchema.safeParse(parseGrpcProduct(call.request));
  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  const { id, data } = parseData;

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
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      doc: data,
      _source: {
        exclude: "deleted",
      },
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      callback({
        code: status.FAILED_PRECONDITION,
        details: "Failed to update product",
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
      details: "Something went wrong",
    });
  }
};
