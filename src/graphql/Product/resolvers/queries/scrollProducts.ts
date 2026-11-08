import { GraphQLError } from "graphql";

import { ProductResolvers } from "#graphql/Product/types";
import { ProductIndex } from "#utils/elastic/types";

export const scrollProducts: ProductResolvers["Query"]["scrollProducts"] =
  async (_, { scrollId }, { elasticSearch }) => {
    try {
      const result = await elasticSearch.scroll<ProductIndex>({
        scroll: "3m",
        scroll_id: scrollId,
        rest_total_hits_as_int: true,
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
      throw new GraphQLError("Internal server error");
    }
  };
