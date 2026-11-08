// Original file: src/grpc/protos/user.proto

import type { User as _User, User__Output as _User__Output } from './User';

export interface GetUsersResponse {
  'users'?: (_User)[];
  'usersCount'?: (number);
}

export interface GetUsersResponse__Output {
  'users'?: (_User__Output)[];
  'usersCount'?: (number);
}
