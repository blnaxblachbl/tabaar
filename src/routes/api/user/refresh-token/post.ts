import type { Request, Response } from "express";
import z from "zod";

import { createContext } from "#utils/context";
import { generateAllTokens } from "#utils/token/generate";
import { USER_FIELDS } from "../constants";
import { verifyRefreshToken } from "#utils/token/verify";

const refreshTokenSchema = z.object(
  {
    refreshToken: z.string("Refresh Token is required"),
  },
  "Body is required",
);

export async function refreshToken(req: Request, res: Response) {
  const { prisma, verify } = await createContext({ req, res });
  if (!verify) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { success, data: body, error } = refreshTokenSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const refreshTokenVerified = verifyRefreshToken(body.refreshToken);
  if (!refreshTokenVerified || verify.id !== refreshTokenVerified.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: verify.id },
      select: USER_FIELDS,
    });
    if (!user || user.deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateAllTokens({
      id: user.id,
      email: user.email,
    });

    res.json({ user, accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
