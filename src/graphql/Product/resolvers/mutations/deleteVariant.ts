import { GraphQLError } from "graphql";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { ProductResolvers } from "#graphql/Product/types";

export const deleteVariant: ProductResolvers["Mutation"]["deleteVariant"] =
  async (_, { id, variantId, select }, { elasticSearch }) => {
    try {
      const result = await elasticSearch.update<
        ProductIndex,
        Partial<ProductIndex>,
        ProductIndex
      >({
        id,
        index: INDEXES.PRODUCTS,
        script: {
          source:
            "ctx._source.variants.removeIf(v -> v.id == params.variantId)",
          lang: "painless",
          params: {
            variantId,
          },
        },
        _source: true,
      });
      if (
        !result.get?._source ||
        !["updated", "noop"].includes(result.result)
      ) {
        console.error(result.result);
        throw new GraphQLError("Failed to delete variant");
      }
      return parseSource(result.get._source);
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Failed to delete variant");
    }
  };
