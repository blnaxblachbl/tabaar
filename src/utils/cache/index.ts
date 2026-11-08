import NodeCache from "node-cache";

import { prisma } from "#utils/prisma";
import { ApiKeyCache } from "./types";

export const cache = new NodeCache({
  stdTTL: Math.floor(Math.random() * 600) + 300, //random cache time for api keys. 5-10 min
});

const API_KEY_SELECT = { id: true, expiredAt: true, name: true };

export async function getApiKey(key: string): Promise<ApiKeyCache | null> {
  const cached = cache.get<ApiKeyCache | undefined>(key);
  if (cached) {
    return cached;
  }
  const apiKey = await prisma.apiKey
    .findFirst({
      where: { key, deleted: false },
      select: API_KEY_SELECT,
    })
    .catch((_) => null);
  if (apiKey) {
    cache.set(key, apiKey);
  }
  return apiKey;
}
