import { findApiKeys } from "./queries/findApiKeys";
import { findOneApiKey } from "./queries/findOneApiKey";
import { createApiKey } from "./mutations/createApiKey";
import { updateApiKey } from "./mutations/updateApiKey";
import { deleteApiKey } from "./mutations/deleteApiKey";

import { ApiKeyResolvers } from "../types";

export default {
  Query: {
    findApiKeys,
    findOneApiKey,
  },
  Mutation: {
    createApiKey,
    updateApiKey,
    deleteApiKey,
  },
} as ApiKeyResolvers;
