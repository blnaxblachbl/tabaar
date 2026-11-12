import { GraphQLError } from "graphql";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { ProductResolvers } from "#graphql/Product/types";

export const restoreProduct: ProductResolvers["Mutation"]["deleteProduct"] =
  async (_, { id }, { elasticSearch }) => {
    try {
      const result = await elasticSearch.update<
        ProductIndex,
        Partial<ProductIndex>,
        ProductIndex
      >({
        id,
        index: INDEXES.PRODUCTS,
        _source: true,
        doc: { deleted: false },
      });
      if (
        !result.get?._source ||
        !["updated", "noop"].includes(result.result)
      ) {
        console.error(result.result);
        throw new GraphQLError("Failed to delete product");
      }
      return parseSource(result.get._source);
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Internal server error");
    }
  };
