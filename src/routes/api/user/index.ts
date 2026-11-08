import express from "express";

import { getUsers } from "./get";
import { createUser } from "./post";
import { getUserById } from "./id/get";
import { updateUser } from "./id/put";
import { deleteUser } from "./id/delete";
import { loginUser } from "./login/post";
import { refreshToken } from "./refresh-token/post";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshToken);

export { userRouter };
