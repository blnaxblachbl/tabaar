import { GraphQLError } from "graphql";

import { UserResolvers } from "#graphql/User/types";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";

export const deleteUser: UserResolvers["Mutation"]["deleteUser"] = async (
  _,
  { id, select },
  { prisma, verify },
) => {
  if (verify?.id === Number(id)) {
    throw new GraphQLError("Cannot delete yourself");
  }
  if (id === 1) {
    throw new GraphQLError("Cannot delete admin user");
  }
  try {
    return prisma.user.update({
      where: { id },
      data: { deleted: true },
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
