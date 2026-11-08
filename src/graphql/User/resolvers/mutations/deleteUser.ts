import { GraphQLError } from "graphql";

import { UserResolvers } from "#graphql/User/types";

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
  return prisma.user.update({
    where: { id },
    data: { deleted: true },
    select,
  });
};
