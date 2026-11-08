import { ShieldedResolver } from "#graphql/types";
import { Prisma, ApiKey } from "#utils/prisma/generated";

export type ApiKeyResolvers = {
  Query: {
    findApiKeys: ShieldedResolver<null, FindApiKeysArgs, FindApiKeysResult>;
    findOneApiKey: ShieldedResolver<null, FindOneArgs, ApiKey | null>;
  };
  Mutation: {
    createApiKey: ShieldedResolver<null, CreateApiKeyArgs, ApiKey>;
    updateApiKey: ShieldedResolver<null, UpdateApiKeyArgs, ApiKey>;
    deleteApiKey: ShieldedResolver<null, DeleteApiKeyArgs, ApiKey>;
  };
};

type FindApiKeysResult = {
  apiKeys: ApiKey[];
  apiKeysCount: number;
};
type FindApiKeysArgs = {
  skip?: number;
  take?: number;
  select?: {
    apiKeys?: {
      select?: Prisma.ApiKeySelect;
    };
    apiKeysCount?: boolean;
  };
};
type FindOneArgs = {
  id: number;
  select?: Prisma.ApiKeySelect;
};
type CreateApiKeyArgs = {
  data: {
    name: string;
    expiredAt: Date;
  };
  select?: Prisma.ApiKeySelect;
};
type UpdateApiKeyArgs = {
  id: number;
  data: {
    name?: string;
    expiredAt?: Date;
  };
  select?: Prisma.ApiKeySelect;
};
type DeleteApiKeyArgs = {
  id: number;
  select?: Prisma.ApiKeySelect;
};
