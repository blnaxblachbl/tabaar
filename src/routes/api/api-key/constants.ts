import { Prisma } from "#utils/prisma/generated";

export const API_KEY_FIELDS: Prisma.ApiKeySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  key: true,
  name: true,
  expiredAt: true,
}
