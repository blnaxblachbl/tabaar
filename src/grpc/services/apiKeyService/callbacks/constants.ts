import { Prisma } from "#utils/prisma/generated";

export const API_KEY_FIELDS: Prisma.ApiKeySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  expiredAt: true,
  name: true,
  key: true,
};
