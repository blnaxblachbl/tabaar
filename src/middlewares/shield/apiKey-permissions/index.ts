import { rules } from "#middlewares/shield/rules";
import { ApiKeyPermissions } from "./types";

export const apiKeyPermissions: ApiKeyPermissions = {
  Query: {
    findApiKeys: rules.isAuthorized,
    findOneApiKey: rules.isAuthorized,
  },
  Mutation: {
    createApiKey: rules.isAuthorized,
    updateApiKey: rules.isAuthorized,
    deleteApiKey: rules.isAuthorized,
  },
};
