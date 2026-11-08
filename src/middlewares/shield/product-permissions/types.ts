import type { ProductResolvers } from "#graphql/Product/types";
import type { RulesList } from "#middlewares/shield/types";

export type ProductPermissions = {
  Query: {
    [key in keyof ProductResolvers["Query"]]: RulesList;
  };
  Mutation: {
    [key in keyof ProductResolvers["Mutation"]]: RulesList;
  };
};
