import type { Request, Response } from "express";

import { idInParams } from "#utils/zod-schemas/id-params";
import { createContext } from "#utils/context";
import { API_KEY_FIELDS } from "../constants";

export const deleteApiKeyById = async (req: Request, res: Response) => {
  const { success, data, error } = idInParams.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { prisma } = await createContext({ req, res });
  try {
    const apiKey = await prisma.apiKey.update({
      where: { id: data.id },
      data: { deleted: true },
      select: API_KEY_FIELDS,
    });
    return res.status(200).json(apiKey);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
