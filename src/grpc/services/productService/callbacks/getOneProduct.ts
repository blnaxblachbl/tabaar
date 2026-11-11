import { handleUnaryCall, status } from "@grpc/grpc-js";

import { GetOneProductRequest } from "#grpc/generated/GetOneProductRequest";
import { GetOneProductResponse } from "#grpc/generated/GetOneProductResponse";
import { stringIdInParams } from "#utils/zod-schemas/id-params";
// import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { INDEXES } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

export const getOneProduct: handleUnaryCall<
  GetOneProductRequest,
  GetOneProductResponse
> = async (call, callback) => {
  // const {
  //   success: apiKeySuccess,
  //   error: apiKeyError,
  //   code,
  // } = await getApiKeyFromGrpc(call.metadata);

  // if (!apiKeySuccess) {
  //   callback({
  //     code,
  //     details: apiKeyError ?? "Something went wrong",
  //   });
  //   return;
  // }
  const { success, data, error } = stringIdInParams.safeParse(call.request);
  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  try {
    const result = await elasticSearch.get<ProductIndex>({
      index: INDEXES.PRODUCTS,
      id: data.id,
      _source: true,
    });
    if (!result._source) {
      callback({
        code: status.NOT_FOUND,
        details: "Product not found",
      });
      return;
    }
    callback(null, {
      product: createGrpcProduct(parseSource(result._source)),
    });
  } catch (e) {
    console.error(e);
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
  }
};
