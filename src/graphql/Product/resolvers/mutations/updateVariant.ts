import { GraphQLError } from "graphql";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { updateVariantSchema } from "#utils/zod-schemas/products";

import { parseSource } from "#utils/elastic/functions";
import { ProductResolvers } from "#graphql/Product/types";

export const updateVariant: ProductResolvers["Mutation"]["updateVariant"] =
  async (_, { id, variantId, data, select }, { elasticSearch }) => {
    const { success, data: parsedData } = updateVariantSchema.safeParse(data);
    if (!success) {
      throw new GraphQLError("Invalid variant data");
    }
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
            "for (variant in ctx._source.variants) { if (variant.id == params.id) { variant.putAll(params.data) }}",
          lang: "painless",
          params: {
            id: variantId,
            data: parsedData,
          },
        },
        _source: true,
      });
      if (
        !result.get?._source ||
        !["updated", "noop"].includes(result.result)
      ) {
        console.error(result.result);
        throw new GraphQLError("Failed to update variant");
      }
      return parseSource(result.get._source);
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Failed to update variant");
    }
  };
