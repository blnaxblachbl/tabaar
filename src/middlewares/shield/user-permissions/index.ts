import { allow } from "graphql-shield";

import { rules } from "#middlewares/shield/rules";
import { UserPermissions } from "./types";

export const userPermissions: UserPermissions = {
  Query: {
    findUsers: rules.isAuthorized,
    findOneUser: rules.isAuthorized,
    findMe: rules.isAuthorized,
  },
  Mutation: {
    createUser: rules.isAuthorized,
    updateUser: rules.isAuthorized,
    deleteUser: rules.isAuthorized,
    refreshToken: rules.isAuthorized,
    loginUser: allow,
  },
};
