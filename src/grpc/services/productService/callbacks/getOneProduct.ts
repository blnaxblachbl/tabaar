import { handleUnaryCall, status } from "@grpc/grpc-js";
import { errors } from "@elastic/elasticsearch";

import { GetOneProductRequest } from "#grpc/generated/GetOneProductRequest";
import { GetOneProductResponse } from "#grpc/generated/GetOneProductResponse";
import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { INDEXES } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

export const getOneProduct: handleUnaryCall<
  GetOneProductRequest,
  GetOneProductResponse
> = async (call, callback) => {
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
      _source_excludes: ["deleted"],
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
  }
};
