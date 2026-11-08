import { GraphQLError } from "graphql";
import { createId } from "@paralleldrive/cuid2";

import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { createProductSchema } from "#utils/zod-schemas/products";

import { ProductResolvers } from "#graphql/Product/types";

export const createProduct: ProductResolvers["Mutation"]["createProduct"] =
  async (_, { data }, { elasticSearch }) => {
    const id = createId();
    const {
      success,
      data: parsedData,
      error,
    } = createProductSchema.safeParse(data);
    if (!success) {
      throw new GraphQLError(error?.issues[0]?.message ?? "Invalid input");
    }
    const document: ProductIndex = {
      id,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: [],
      ...parsedData,
    };

    try {
      const result = await elasticSearch.index<ProductIndex>({
        id,
        index: INDEXES.PRODUCTS,
        document,
      });
      if (!["created", "noop"].includes(result.result)) {
        throw new GraphQLError("Failed to create product");
      }
      return { ...document, minPrice: 0, maxPrice: 0, available: false };
    } catch (e) {
      console.error(e);
      throw new GraphQLError("Internal server error");
    }
  };
