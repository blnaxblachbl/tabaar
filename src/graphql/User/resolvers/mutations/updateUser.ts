import { GraphQLError } from "graphql";

import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";
import { UserResolvers } from "#graphql/User/types";

export const updateUser: UserResolvers["Mutation"]["updateUser"] = async (
  _,
  { id, data, select },
  { prisma },
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id, deleted: false },
      data,
      select,
    });
    return updatedUser;
  } catch (e) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new GraphQLError("Email already in use");
      }
    }
    throw new GraphQLError(`Something went wrong`);
  }
};
