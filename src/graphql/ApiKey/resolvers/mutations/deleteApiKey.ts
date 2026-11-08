import { GraphQLError } from "graphql";

import { ApiKeyResolvers } from "#graphql/ApiKey/types";

export const deleteApiKey: ApiKeyResolvers["Mutation"]["deleteApiKey"] = async (
  _,
  { id, select },
  { prisma },
) => {
  try {
    const deletedApiKey = await prisma.apiKey.update({
      where: { id, deleted: false },
      data: { deleted: true },
      select,
    });
    return deletedApiKey;
  } catch (e) {
    console.error(e);
    throw new GraphQLError(`Something went wrong`);
  }
};
