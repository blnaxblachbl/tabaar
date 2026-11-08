import { Prisma } from "#utils/prisma/generated";

export const USER_FIELDS: Prisma.UserSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  email: true,
};
