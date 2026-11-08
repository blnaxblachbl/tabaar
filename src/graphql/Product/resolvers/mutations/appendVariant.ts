import { GraphQLError } from "graphql";
import { createId } from "@paralleldrive/cuid2";

import { INDEXES, ProductIndex, VariantIndex } from "#utils/elastic/types";
import { appendVariantSchema } from "#utils/zod-schemas/products";
import { parseSource } from "#utils/elastic/functions";
import { ProductResolvers } from "#graphql/Product/types";

export const appendVariant: ProductResolvers["Mutation"]["appendVariant"] =
  async (_, { id, data, select }, { elasticSearch }) => {
    try {
      const {
        success: variantSuccess,
        data: parsedVariantData,
        error: variantError,
      } = appendVariantSchema.safeParse(data);
      if (!variantSuccess) {
        throw new GraphQLError(
          variantError?.issues[0]?.message ?? "Invalid input",
        );
      }
      const variant: VariantIndex = {
        id: createId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        images: [],
        ...parsedVariantData,
      };
      const result = await elasticSearch.update<
        ProductIndex,
        Partial<ProductIndex>,
        ProductIndex
      >({
        id,
        index: INDEXES.PRODUCTS,
        script: {
          source: "ctx._source.variants.add(params.variant)",
          lang: "painless",
          params: {
            variant,
          },
        },
        _source: true,
      });
      if (
        !result.get?._source ||
        !["updated", "noop"].includes(result.result)
      ) {
        console.error(result.result);
        throw new GraphQLError("Failed to create variant");
      }
      return parseSource(result.get._source);
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Failed to create variant");
    }
  };
