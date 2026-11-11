import { handleUnaryCall, status } from "@grpc/grpc-js";

import { ScrollProductsRequest } from "#grpc/generated/ScrollProductsRequest";
import { GetProductsResponse } from "#grpc/generated/GetProductsResponse";
// import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { createGrpcProduct } from "#utils/grpc/product";
import { scrollSchema } from "#utils/zod-schemas/skip-take";

export const scrollProducts: handleUnaryCall<
  ScrollProductsRequest,
  GetProductsResponse
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
  const { success, data, error } = scrollSchema.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  const { scrollId } = data;
  try {
    const result = await elasticSearch.scroll<ProductIndex>({
      scroll: "3m",
      scroll_id: scrollId,
      rest_total_hits_as_int: true,
    });
    callback(null, {
      products: result.hits.hits.map((hit) => ({
        ...createGrpcProduct(hit._source!),
        minPrice: hit.fields?.min_price[0] ?? 0,
        maxPrice: hit.fields?.max_price[0] ?? 0,
        available: hit.fields?.available[0] ?? false,
      })),
      productsCount: result.hits.total as number,
      scrollId: result._scroll_id,
    });
  } catch (e) {
    console.error(error);
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
  }
};
