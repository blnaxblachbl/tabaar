import { GraphQLError } from "graphql";

import { ProductResolvers } from "#graphql/Product/types";
import { INDEXES } from "#utils/elastic/types";
import { ProductIndex } from "#utils/elastic/types";
import { selectToEsSource } from "#utils/tools/selectToEsSource";
import { parseSource } from "#utils/elastic/functions";

export const findOneProduct: ProductResolvers["Query"]["findOneProduct"] =
  async (_, { id, select }, { elasticSearch }) => {
    try {
      const result = await elasticSearch.get<ProductIndex>({
        index: INDEXES.PRODUCTS,
        id,
        _source: selectToEsSource(select),
      });
      if (!result._source) {
        throw new GraphQLError("Product not found");
      }
      return parseSource(result._source);
    } catch (e) {
      throw new GraphQLError("Internal server error");
    }
  };
