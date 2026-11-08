import type { UserResolvers } from "#graphql/User/types";
import type { RulesList } from "#middlewares/shield/types";

export type UserPermissions = {
  Query: {
    [key in keyof UserResolvers["Query"]]: RulesList;
  };
  Mutation: {
    [key in keyof UserResolvers["Mutation"]]: RulesList;
  };
};
