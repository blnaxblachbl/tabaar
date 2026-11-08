import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import z from "zod";

import { createContext } from "#utils/context";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";
import { USER_FIELDS } from "#routes/api/user/constants";
import { generateRandomString } from "#utils/randomString";
import { ENV } from "#utils/config";

const bodySchema = z.object({
  name: z.string("Name is required"),
  email: z.string("Email is required").email("Invalid email"),
});

export async function createUser(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const {
    success,
    data: body,
    error: bodyError,
  } = bodySchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ message: bodyError.issues[0].message });
  }
  const generatedPassword = generateRandomString(16);
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  if (ENV.IS_DEV) {
    console.log("password", generatedPassword);
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
      select: USER_FIELDS,
    });
    if (!user) {
      return new Error("Something went wrong");
    }
    res.json(user);
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}
