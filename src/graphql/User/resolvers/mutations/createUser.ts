import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";

import { generateRandomString } from "#utils/randomString";
import { UserResolvers } from "#graphql/User/types";
import { ENV } from "#utils/config";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";

export const createUser: UserResolvers["Mutation"]["createUser"] = async (
  _,
  { data, select },
  { prisma },
) => {
  const generatedPassword = generateRandomString(16);
  const hashedPassword = bcrypt.hashSync(generatedPassword);
  if (ENV.IS_DEV) {
    console.log("password", generatedPassword);
  }

  return prisma.user
    .create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select,
    })
    .catch((e: unknown) => {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          throw new GraphQLError("Email already in use");
        }
      }
      throw new GraphQLError("Unknown error");
    });
};
