import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { GetArchivedProductsRequest } from "#grpc/generated/GetArchivedProductsRequest";
import { GetArchivedProductsResponse } from "#grpc/generated/GetArchivedProductsResponse";
import { searchSchema } from "#utils/zod-schemas/skip-take";
import { filtersSchema } from "#utils/zod-schemas/products";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { INDEXES } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { getProductsQuery } from "#utils/elastic/functions";
import { createGrpcProduct } from "#utils/grpc/product";

export const getArchivedProducts: handleUnaryCall<
  GetArchivedProductsRequest,
  GetArchivedProductsResponse
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

  const { success, data, error } = z
    .intersection(
      searchSchema,
      z.object({
        filters: filtersSchema,
      }),
    )
    .safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  const { query, take = 50, filters } = data;
  const searchQuery = getProductsQuery(filters, true);
  try {
    const result = await elasticSearch.search<ProductIndex>({
      index: INDEXES.PRODUCTS,
      q: query,
      query: searchQuery,
      size: take,
      sort: [{ createdAt: "desc" }, { id: "desc" }],
      fields: ["min_price", "max_price", "available"],
      rest_total_hits_as_int: true,
      scroll: "3m",
      _source: {
        exclude: "deleted",
      },
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
  } catch (error) {
    console.error(error);
    callback({
      code: status.INTERNAL,
      details: "Internal server error",
    });
  }
};
