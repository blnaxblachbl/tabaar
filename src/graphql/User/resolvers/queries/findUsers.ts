import { UserResolvers } from "#graphql/User/types";
import { Prisma } from "#utils/prisma/generated";

export const findUsers: UserResolvers["Query"]["findUsers"] = async (
  _,
  { select, skip = 0, take = 50 },
  { prisma, verify },
) => {
  const where: Prisma.UserWhereInput = {
    id: { not: { equals: verify.id } },
    deleted: { equals: false },
  };
  const [users, usersCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: select?.user?.select,
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    usersCount,
  };
};
