import type { ApiKeyResolvers } from "#graphql/ApiKey/types";
import type { RulesList } from "#middlewares/shield/types";

export type ApiKeyPermissions = {
  Query: {
    [key in keyof ApiKeyResolvers["Query"]]: RulesList;
  };
  Mutation: {
    [key in keyof ApiKeyResolvers["Mutation"]]: RulesList;
  };
};
