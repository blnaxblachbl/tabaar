import { findProducts } from "./queries/findProducts";
import { scrollProducts } from "./queries/scrollProducts";
import { findOneProduct } from "./queries/findOneProduct";
import { createProduct } from "./mutations/createProduct";
import { updateProduct } from "./mutations/updateProduct";
import { deleteProduct } from "./mutations/deleteProduct";
import { appendVariant } from "./mutations/appendVariant";
import { deleteVariant } from "./mutations/deleteVariant";
import { updateVariant } from "./mutations/updateVariant";
import { ProductResolvers } from "../types";

export default {
  Query: {
    findProducts,
    scrollProducts,
    findOneProduct,
  },
  Mutation: {
    createProduct,
    updateProduct,
    deleteProduct,
    appendVariant,
    deleteVariant,
    updateVariant,
  },
} as ProductResolvers;
