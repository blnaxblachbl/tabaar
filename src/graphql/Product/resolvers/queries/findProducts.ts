import { GraphQLError } from "graphql";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { selectToEsSource } from "#utils/tools/selectToEsSource";
import type { ProductResolvers } from "#graphql/Product/types";
import { getProductsQuery } from "#utils/elastic/functions";

export const findProducts: ProductResolvers["Query"]["findProducts"] = async (
  _,
  { query, take = 50, select, filters },
  { elasticSearch },
) => {
  const searchQuery = getProductsQuery(filters);
  try {
    const result = await elasticSearch.search<ProductIndex>({
      index: INDEXES.PRODUCTS,
      q: query,
      query: searchQuery,
      size: take,
      sort: [{ createdAt: "desc" }],
      _source: selectToEsSource(select?.products?.select),
      fields: ["min_price", "max_price", "available"],
      rest_total_hits_as_int: true,
      scroll: "3m",
    });
    return {
      products: result.hits.hits.map((hit) => ({
        ...hit._source!,
        minPrice: hit.fields?.min_price[0] ?? 0,
        maxPrice: hit.fields?.max_price[0] ?? 0,
        available: hit.fields?.available[0] ?? false,
      })),
      productsCount: result.hits.total as number,
      scrollId: result._scroll_id!,
    };
  } catch (e) {
    console.error(e);
    throw new GraphQLError("Internal server error");
  }
};
