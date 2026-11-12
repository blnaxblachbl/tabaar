import { findProducts } from "./queries/findProducts";
import { scrollProducts } from "./queries/scrollProducts";
import { findOneProduct } from "./queries/findOneProduct";
import { findDeletedProducts } from "./queries/findDeletedProducts";
import { scrollDeletedProducts } from "./queries/scrollDeletedProducts";

import { createProduct } from "./mutations/createProduct";
import { updateProduct } from "./mutations/updateProduct";
import { deleteProduct } from "./mutations/deleteProduct";
import { appendVariant } from "./mutations/appendVariant";
import { deleteVariant } from "./mutations/deleteVariant";
import { updateVariant } from "./mutations/updateVariant";
import { restoreProduct } from "./mutations/restoreProduct";

import { ProductResolvers } from "../types";

export default {
  Query: {
    findProducts,
    scrollProducts,
    findOneProduct,
    findDeletedProducts,
    scrollDeletedProducts,
  },
  Mutation: {
    createProduct,
    updateProduct,
    deleteProduct,
    appendVariant,
    deleteVariant,
    updateVariant,
    restoreProduct,
  },
} as ProductResolvers;
