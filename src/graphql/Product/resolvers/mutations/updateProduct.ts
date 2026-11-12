import { GraphQLError } from "graphql";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { updateProductSchema } from "#utils/zod-schemas/products";
import { parseSource } from "#utils/elastic/functions";
import { ProductResolvers } from "#graphql/Product/types";

export const updateProduct: ProductResolvers["Mutation"]["updateProduct"] =
  async (_, { id, data }, { elasticSearch }) => {
    try {
      const {
        success: updateSuccess,
        data: parsedUpdateData,
        error: updateError,
      } = updateProductSchema.safeParse(data);
      if (!updateSuccess) {
        throw new GraphQLError(
          updateError?.issues[0]?.message ?? "Invalid input",
        );
      }
      const exist = await elasticSearch.get<ProductIndex>({
        id,
        index: INDEXES.PRODUCTS,
        _source: true,
      });
      if (!exist.found || exist._source?.deleted) {
        throw new GraphQLError("Product not found");
      }
      const result = await elasticSearch.update<
        ProductIndex,
        Partial<ProductIndex>,
        ProductIndex
      >({
        id,
        index: INDEXES.PRODUCTS,
        doc: parsedUpdateData,
        _source: true,
      });
      if (
        !result.get?._source ||
        !["updated", "noop"].includes(result.result)
      ) {
        console.error(result.result);
        throw new GraphQLError("Failed to create variant");
      }
      return parseSource(result.get?._source);
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Internal server error");
    }
  };
