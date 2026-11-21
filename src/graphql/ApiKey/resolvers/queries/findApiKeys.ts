import { Prisma } from "#utils/prisma/generated";
import { ApiKeyResolvers } from "#graphql/ApiKey/types";

export const findApiKeys: ApiKeyResolvers["Query"]["findApiKeys"] = async (
  _,
  { select, skip = 0, take = 50, filters },
  { prisma },
) => {
  const where: Prisma.ApiKeyWhereInput = {
    deleted: { equals: false },
  };
  if (filters?.expired) {
    where.expiredAt = {
      lt: new Date(),
    };
  }
  if (filters?.search) {
    where.name = {
      search: filters.search.trim().replace(/\s+/, " | "),
    };
  }
  const [apiKeys, apiKeysCount] = await Promise.all([
    prisma.apiKey.findMany({
      where,
      select: select?.apiKeys?.select,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.apiKey.count({ where }),
  ]);
  return { apiKeys, apiKeysCount };
};
