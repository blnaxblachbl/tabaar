import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { UpdateUserRequest } from "#grpc/generated/UpdateUserRequest";
import { UpdateUserResponse } from "#grpc/generated/UpdateUserResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { USER_FIELDS } from "./constants";

const bodySchema = z.object({
  id: z.number("Id is required"),
  name: z.string("Name is required").optional(),
  email: z.string("Email is required").email("Invalid email").optional(),
});

export const updateUser: handleUnaryCall<
  UpdateUserRequest,
  UpdateUserResponse
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

  try {
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
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
    callback(null, {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        callback({
          code: status.INVALID_ARGUMENT,
          details: "Email already in use",
        });
        return;
      }
      if (e.code === "P2025") {
        callback({
          code: status.NOT_FOUND,
          details: "User not found",
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
