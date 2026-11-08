// Original file: src/grpc/protos/user.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateUserRequest as _CreateUserRequest, CreateUserRequest__Output as _CreateUserRequest__Output } from './CreateUserRequest';
import type { CreateUserResponse as _CreateUserResponse, CreateUserResponse__Output as _CreateUserResponse__Output } from './CreateUserResponse';
import type { DeleteUserRequest as _DeleteUserRequest, DeleteUserRequest__Output as _DeleteUserRequest__Output } from './DeleteUserRequest';
import type { DeleteUserResponse as _DeleteUserResponse, DeleteUserResponse__Output as _DeleteUserResponse__Output } from './DeleteUserResponse';
import type { GetOneUserRequest as _GetOneUserRequest, GetOneUserRequest__Output as _GetOneUserRequest__Output } from './GetOneUserRequest';
import type { GetOneUserResponse as _GetOneUserResponse, GetOneUserResponse__Output as _GetOneUserResponse__Output } from './GetOneUserResponse';
import type { GetUsersRequest as _GetUsersRequest, GetUsersRequest__Output as _GetUsersRequest__Output } from './GetUsersRequest';
import type { GetUsersResponse as _GetUsersResponse, GetUsersResponse__Output as _GetUsersResponse__Output } from './GetUsersResponse';
import type { UpdateUserRequest as _UpdateUserRequest, UpdateUserRequest__Output as _UpdateUserRequest__Output } from './UpdateUserRequest';
import type { UpdateUserResponse as _UpdateUserResponse, UpdateUserResponse__Output as _UpdateUserResponse__Output } from './UpdateUserResponse';

export interface UserServiceDefinition {
  CreateUser: MethodDefinition<_CreateUserRequest, _CreateUserResponse, _CreateUserRequest__Output, _CreateUserResponse__Output>
  DeleteUser: MethodDefinition<_DeleteUserRequest, _DeleteUserResponse, _DeleteUserRequest__Output, _DeleteUserResponse__Output>
  GetOneUser: MethodDefinition<_GetOneUserRequest, _GetOneUserResponse, _GetOneUserRequest__Output, _GetOneUserResponse__Output>
  GetUsers: MethodDefinition<_GetUsersRequest, _GetUsersResponse, _GetUsersRequest__Output, _GetUsersResponse__Output>
  UpdateUser: MethodDefinition<_UpdateUserRequest, _UpdateUserResponse, _UpdateUserRequest__Output, _UpdateUserResponse__Output>
}
