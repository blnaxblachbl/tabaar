import { GraphQLError } from "graphql";

import { ApiKeyResolvers } from "#graphql/ApiKey/types";

export const findOneApiKey: ApiKeyResolvers["Query"]["findOneApiKey"] = async (
  _,
  { id, select },
  { prisma },
) => {
  const result = await prisma.apiKey
    .findUnique({
      where: { id, deleted: false },
      select,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  if (!result) {
    throw new GraphQLError(`ApiKey with id ${id} not found`);
  }
  return result;
};
