import { ApiKey } from "#utils/prisma/generated";

export type ApiKeyCache = Pick<ApiKey, "id" | "expiredAt" | "name">;
