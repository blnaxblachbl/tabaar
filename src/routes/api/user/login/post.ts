import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createContext } from "#utils/context";
import { USER_FIELDS } from "../constants";
import { generateAllTokens } from "#utils/token/generate";

const bodySchema = z.object({
  email: z.string("Email is required").email("Invalid email"),
  password: z.string("Password is required"),
});

export async function loginUser(
  req: Request<any, any, { email: string; password: string }>,
  res: Response,
) {
  const { success, data: body, error } = bodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { email, password } = body;

  const { prisma } = await createContext({ req, res });
  try {
    const user = await prisma.user
      .findUnique({
        where: { email },
        select: { ...USER_FIELDS, password: true },
      })
      .catch((e) => {
        return null;
      });
    if (!user || user.deleted || !bcrypt.compareSync(password, user.password)) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const { password: _userPassword, ...userData } = user;
    const { accessToken, refreshToken } = generateAllTokens({
      id: userData.id,
      email: userData.email,
    });
    return res.json({ user: userData, accessToken, refreshToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
