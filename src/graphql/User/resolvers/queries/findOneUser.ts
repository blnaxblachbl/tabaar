import { GraphQLError } from "graphql";

import { UserResolvers } from "#graphql/User/types";

export const findOneUser: UserResolvers["Query"]["findOneUser"] = async (
  _,
  { id, select },
  { prisma },
) => {
  const user = await prisma.user
    .findUnique({
      where: { id, deleted: false },
      select,
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (!user) {
    throw new GraphQLError("User not found");
  }
  return user;
};
