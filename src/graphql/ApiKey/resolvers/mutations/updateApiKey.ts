import { GraphQLError } from "graphql";

import { cache } from "#utils/cache";
import { ApiKeyResolvers } from "#graphql/ApiKey/types";

export const updateApiKey: ApiKeyResolvers["Mutation"]["updateApiKey"] = async (
  _,
  { id, data, select },
  { prisma },
) => {
  const updatedApiKey = await prisma.apiKey
    .update({
      where: { id, deleted: false },
      data,
      select: {
        ...select,
        id: true,
        key: true,
        name: true,
        expiredAt: true,
      },
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  if (!updatedApiKey) {
    throw new GraphQLError(`ApiKey with id ${id} not found`);
  }
  cache.set(updatedApiKey.key, {
    id: updatedApiKey.id,
    name: updatedApiKey.name,
    expiredAt: updatedApiKey.expiredAt,
  });
  return updatedApiKey;
};
