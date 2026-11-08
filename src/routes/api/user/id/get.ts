import type { Request, Response } from "express";

import { idInParams } from "#utils/zod-schemas/id-params";
import { createContext } from "#utils/context";
import { USER_FIELDS } from "#routes/api/user/constants";
import { UserIdParams } from "#routes/api/user/id/types";

export async function getUserById(req: Request<UserIdParams>, res: Response) {
  const { prisma } = await createContext({ req, res });
  const { success, data: params, error } = idInParams.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { id } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_FIELDS,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
