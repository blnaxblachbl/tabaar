import type { Request, Response } from "express";
import z from "zod";

import { createContext } from "#utils/context";
import { createApiKeySchema } from "#utils/zod-schemas/api-key";

export async function createApiKey(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const { success, data, error } = createApiKeySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  try {
    const apiKey = await prisma.apiKey.create({
      data,
    });
    return res.json(apiKey);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
