import { UserResolvers } from "#graphql/User/types";
import { GraphQLError } from "graphql";

export const findMe: UserResolvers["Query"]["findMe"] = async (
  _,
  { select },
  { prisma, verify },
) => {
  const user = await prisma.user.findUnique({
    where: { id: verify.id },
    select,
  });
  if (!user) {
    throw new GraphQLError("User not found");
  }
  return user;
};
