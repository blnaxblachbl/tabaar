import type { Request, Response } from "express";

import { createContext } from "#utils/context";
import { Prisma } from "#utils/prisma/generated/client";
import { skipTakeSchema } from "#utils/zod-schemas/skip-take";
import { USER_FIELDS } from "./constants";

export async function getUsers(req: Request, res: Response) {
  const { prisma, verify } = await createContext({ req, res });
  const {
    success,
    data: queryParams,
    error,
  } = skipTakeSchema.safeParse(req.query);

  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }

  const where: Prisma.UserWhereInput = {
    id: verify ? { not: { equals: verify.id } } : undefined,
    deleted: { equals: false },
  };
  try {
    const [users, usersCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_FIELDS,
        skip: queryParams.skip,
        take: queryParams.take,
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ users, usersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
