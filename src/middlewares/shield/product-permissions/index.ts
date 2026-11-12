import { allow } from "graphql-shield";

import { rules } from "#middlewares/shield/rules";
import { ProductPermissions } from "./types";

export const productPermissions: ProductPermissions = {
  Query: {
    findProducts: allow,
    scrollProducts: allow,
    findOneProduct: allow,
    findDeletedProducts: rules.isAuthorized,
    scrollDeletedProducts: rules.isAuthorized,
  },
  Mutation: {
    createProduct: rules.isAuthorized,
    updateProduct: rules.isAuthorized,
    deleteProduct: rules.isAuthorized,
    appendVariant: rules.isAuthorized,
    updateVariant: rules.isAuthorized,
    deleteVariant: rules.isAuthorized,
    restoreProduct: rules.isAuthorized,
  },
};
