import { GraphQLError } from "graphql";

import { UserResolvers } from "#graphql/User/types";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";

export const restoreUser: UserResolvers["Mutation"]["restoreUser"] = async (
  _,
  { id, select },
  { prisma },
) => {
  try {
    return prisma.user.update({
      where: { id },
      data: { deleted: false },
      select,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new GraphQLError("User not found");
      }
    }
    throw new GraphQLError(`Something went wrong`);
  }
};
