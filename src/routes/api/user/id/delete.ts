import type { Request, Response } from "express";

import { idInParams } from "#utils/zod-schemas/id-params";
import { createContext } from "#utils/context";
import { USER_FIELDS } from "#routes/api/user/constants";
import { UserIdParams } from "./types";

export async function deleteUser(req: Request<UserIdParams>, res: Response) {
  const { success, data: params, error } = idInParams.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { id } = params;
  const { prisma, verify } = await createContext({ req, res });
  if (verify?.id === id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }
  if (id === 1) {
    return res.status(403).json({ message: "Cannot delete admin user" });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { deleted: true },
      select: USER_FIELDS,
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Unknown error" });
  }
}
