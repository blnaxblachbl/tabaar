import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";
import bcrypt from "bcryptjs";

import { CreateUserResponse } from "#grpc/generated/CreateUserResponse";
import { CreateUserRequest } from "#grpc/generated/CreateUserRequest";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { generateRandomString } from "#utils/randomString";
import { ENV } from "#utils/config";
import { sendEmail } from "#utils/mailer";
import { USER_FIELDS } from "./constants";

const bodySchema = z.object({
  name: z.string("Name is required"),
  email: z.string("Email is required").email("Invalid email"),
});

export const createUser: handleUnaryCall<
  CreateUserRequest,
  CreateUserResponse
> = async (call, callback) => {
  const { success, error, code } = await getApiKeyFromGrpc(call.metadata);
  if (!success) {
    callback({ code, details: error ?? "Something went wrong" });
    return;
  }
  const {
    success: bodySuccess,
    data,
    error: bodyError,
  } = bodySchema.safeParse(call.request);
  if (!bodySuccess) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: bodyError?.issues[0]?.message ?? "Invalid request",
    });
    return;
  }

  const generatedPassword = generateRandomString(16);
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  if (ENV.IS_DEV) {
    console.log("password", generatedPassword);
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: USER_FIELDS,
    });
    if (!user) {
      callback({
        code: status.UNKNOWN,
        details: "Something went wrong",
      });
      return;
    }
    sendEmail(user.email, "Tabaar Account Details", generatedPassword);
    callback(null, {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        callback({
          code: status.INVALID_ARGUMENT,
          details: "Email already in use",
        });
        return;
      }
    }
    callback({
      code: status.INTERNAL,
      details: "Something went wrong",
    });
  }
};
