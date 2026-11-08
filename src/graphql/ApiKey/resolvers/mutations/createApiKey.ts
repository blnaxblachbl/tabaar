import { GraphQLError } from "graphql";

import { ApiKeyResolvers } from "#graphql/ApiKey/types";

export const createApiKey: ApiKeyResolvers["Mutation"]["createApiKey"] = async (
  _,
  { data, select },
  { prisma },
) => {
  try {
    return prisma.apiKey.create({
      data,
      select,
    });
  } catch (error) {
    console.error(error);
    throw new GraphQLError(`Something went wrong`);
  }
};
