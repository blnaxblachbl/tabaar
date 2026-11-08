import { ShieldedResolver, Resolver } from "#graphql/types";
import { Prisma, User } from "#utils/prisma/generated";

export type UserResolvers = {
  Query: {
    findUsers: ShieldedResolver<null, FindUsersArgs, FindUsersResult>;
    findOneUser: ShieldedResolver<null, FindOneUserArgs, User>;
    findMe: ShieldedResolver<null, FindMeArgs, User>;
  };
  Mutation: {
    createUser: ShieldedResolver<null, CreateUserArgs, User>;
    updateUser: ShieldedResolver<null, UpdateUserArgs, User>;
    loginUser: Resolver<null, LoginUserArgs, LoginUserResult>;
    refreshToken: ShieldedResolver<null, RefreshTokenArgs, LoginUserResult>;
    deleteUser: ShieldedResolver<null, DeleteUserArgs, User>;
  };
};
type FindMeArgs = {
  select?: Prisma.UserSelect;
};
type DeleteUserArgs = {
  id: number;
  select?: Prisma.UserSelect;
};
type FindOneUserArgs = {
  id: number;
  select?: Prisma.UserSelect;
};
type RefreshTokenArgs = {
  data: {
    refreshToken: string;
  };
  select?: {
    user?: { select: Prisma.UserSelect };
    accessToken?: boolean;
    refreshToken?: boolean;
  };
};
type LoginUserResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
type FindUsersArgs = {
  skip?: number;
  take?: number;
  select?: {
    usersCount?: boolean;
    user?: {
      select?: Prisma.UserSelect;
    };
  };
};
type CreateUserArgs = {
  data: {
    email: string;
    name: string;
  };
  select: Prisma.UserSelect;
};
type UpdateUserArgs = {
  id: number;
  data: {
    email: string;
    name: string;
  };
  select: Prisma.UserSelect;
};
type LoginUserArgs = {
  data: {
    email: string;
    password: string;
  };
  select: {
    user: { select: Prisma.UserSelect };
    accessToken: boolean;
    refreshToken: boolean;
  };
};
type FindUsersResult = {
  users: User[];
  usersCount: number;
};
