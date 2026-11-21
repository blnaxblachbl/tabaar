import type { Request, Response } from "express";
import z from "zod";

import { skipTakeSchema } from "#utils/zod-schemas/skip-take";
import { createContext } from "#utils/context";
import { Prisma } from "#utils/prisma/generated/client";
import { API_KEY_FIELDS } from "./constants";
import { apiKeyFiltersSchama } from "#utils/zod-schemas/api-key";

const queryParamSchema = z.object({
  ...apiKeyFiltersSchama.shape,
  ...skipTakeSchema.shape,
});

export async function getApiKeys(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const {
    success,
    data: queryParams,
    error,
  } = queryParamSchema.safeParse(req.query);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const where: Prisma.ApiKeyWhereInput = {
    deleted: { equals: false },
  };
  if (queryParams?.expired === "true") {
    where.expiredAt = {
      lt: new Date(),
    };
  }
  if (queryParams?.search) {
    where.name = {
      search: queryParams.search.trim().replace(/\s+/, " | "),
    };
  }
  try {
    const [apiKeys, apiKeysCount] = await Promise.all([
      prisma.apiKey.findMany({
        where,
        skip: queryParams.skip,
        take: queryParams.take,
        select: API_KEY_FIELDS,
      }),
      prisma.apiKey.count({ where }),
    ]);

    res.json({ apiKeys, apiKeysCount });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
