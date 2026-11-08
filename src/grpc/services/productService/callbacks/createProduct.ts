import { handleUnaryCall, status } from "@grpc/grpc-js";
import { createId } from "@paralleldrive/cuid2";

import { CreateProductRequest } from "#grpc/generated/CreateProductRequest";
import { CreateProductResponse } from "#grpc/generated/CreateProductResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { createProductSchema } from "#utils/zod-schemas/products";
import { parseStruct } from "#utils/grpc/google";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { createGrpcProduct } from "#utils/grpc/product";

export const createProduct: handleUnaryCall<
  CreateProductRequest,
  CreateProductResponse
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

  const { success, data, error } = createProductSchema.safeParse({
    ...call.request,
    characterstics: parseStruct(call.request.characterstics ?? {}),
  });

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  const id = createId();

  const document: ProductIndex = {
    id,
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [],
    ...data,
  };

  try {
    const result = await elasticSearch.index<ProductIndex>({
      id,
      index: INDEXES.PRODUCTS,
      document,
    });
    if (!["created", "noop"].includes(result.result)) {
      callback({
        code: status.FAILED_PRECONDITION,
        details: "Failed to create product",
      });
      return;
    }
    callback(null, {
      product: {
        ...createGrpcProduct(document),
        minPrice: 0,
        maxPrice: 0,
        available: false,
      },
    });
  } catch (e) {
    console.error(e);
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
    return;
  }
};
