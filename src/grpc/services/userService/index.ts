import {
  ServiceClientConstructor,
  loadPackageDefinition,
  Server,
} from "@grpc/grpc-js";
import { type PackageDefinition } from "@grpc/proto-loader";

import { getUsers } from "./callbacks/getUsers";
import { getOneUser } from "./callbacks/getOneUser";
import { createUser } from "./callbacks/createUser";
import { updateUser } from "./callbacks/updateUser";
import { deleteUser } from "./callbacks/deleteUser";

export function addUserService(server: Server, definition: PackageDefinition) {
  const proto = loadPackageDefinition(definition);

  server.addService((proto.UserService as ServiceClientConstructor).service, {
    GetUsers: getUsers,
    GetOneUser: getOneUser,
    CreateUser: createUser,
    UpdateUser: updateUser,
    DeleteUser: deleteUser,
  });
}
