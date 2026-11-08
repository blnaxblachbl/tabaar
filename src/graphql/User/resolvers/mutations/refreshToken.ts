import { GraphQLError } from "graphql";

import { generateAllTokens } from "#utils/token/generate";
import { verifyRefreshToken } from "#utils/token/verify";

import { UserResolvers } from "#graphql/User/types";

export const refreshToken: UserResolvers["Mutation"]["refreshToken"] = async (
  _,
  { data, select },
  { prisma, verify },
) => {
  const tokenData = verifyRefreshToken(data.refreshToken);
  if (!tokenData || verify.id !== tokenData.id) {
    throw new Error("Invalid refresh token");
  }
  const user = await prisma.user.findUnique({
    where: { id: tokenData.id },
    select: {
      id: true,
      email: true,
      ...select?.user?.select,
    },
  });
  if (!user) {
    throw new GraphQLError("User not found");
  }
  const { accessToken, refreshToken } = generateAllTokens({
    id: user.id,
    email: user.email,
  });
  return { user, accessToken, refreshToken };
};
