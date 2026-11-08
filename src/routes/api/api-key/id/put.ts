import type { Request, Response } from "express";

import { Prisma } from "#utils/prisma/generated/client";
import { createContext } from "#utils/context";
import { idInParams } from "#utils/zod-schemas/id-params";
import { updateApiKeySchema } from "#utils/zod-schemas/api-key";
import { API_KEY_FIELDS } from "../constants";

export async function updateApiKey(req: Request, res: Response) {
  const {
    success: paramsSuccess,
    data: paramsData,
    error: paramsError,
  } = idInParams.safeParse(req.params);
  if (!paramsSuccess) {
    return res.status(400).json({ message: paramsError.issues[0].message });
  }
  const {
    success: bodySuccess,
    data: body,
    error,
  } = updateApiKeySchema.safeParse(req.body);
  if (!bodySuccess) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { prisma } = await createContext({ req, res });
  try {
    const apiKey = await prisma.apiKey.update({
      where: { id: paramsData.id, deleted: false },
      data: body,
      select: API_KEY_FIELDS,
    });
    return res.status(200).json(apiKey);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Api key not found" });
      }
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
}
