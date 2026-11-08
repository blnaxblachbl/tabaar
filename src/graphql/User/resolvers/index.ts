import { findUsers } from "./queries/findUsers";
import { findOneUser } from "./queries/findOneUser";
import { loginUser } from "./mutations/loginUser";
import { createUser } from "./mutations/createUser";
import { updateUser } from "./mutations/updateUser";
import { refreshToken } from "./mutations/refreshToken";
import { deleteUser } from "./mutations/deleteUser";
import { findMe } from "./queries/findMe";

import { UserResolvers } from "../types";

export default {
  Query: {
    findUsers,
    findOneUser,
    findMe,
  },
  Mutation: {
    loginUser,
    createUser,
    updateUser,
    refreshToken,
    deleteUser,
  },
} as UserResolvers;
