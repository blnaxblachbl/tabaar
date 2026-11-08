import { shield, allow } from "graphql-shield";
import { GraphQLError } from "graphql";

import { userPermissions } from "./user-permissions";
import { apiKeyPermissions } from "./apiKey-permissions";
import { productPermissions } from "./product-permissions";

export const permissions = shield(
  {
    Query: {
      ...userPermissions.Query,
      ...apiKeyPermissions.Query,
      ...productPermissions.Query,
    },
    Mutation: {
      ...userPermissions.Mutation,
      ...apiKeyPermissions.Mutation,
      ...productPermissions.Mutation,
    },
  },
  {
    allowExternalErrors: true,
    fallbackError: new GraphQLError("Forbidden"),
    fallbackRule: allow,
  },
);
