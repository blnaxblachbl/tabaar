import { handleUnaryCall, status } from "@grpc/grpc-js";

import { DeleteUserRequest } from "#grpc/generated/DeleteUserRequest";
import { DeleteUserResponse } from "#grpc/generated/DeleteUserResponse";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { USER_FIELDS } from "./constants";
import { idInParams } from "#utils/zod-schemas/id-params";

export const deleteUser: handleUnaryCall<
  DeleteUserRequest,
  DeleteUserResponse
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
  } = idInParams.safeParse(call.request);
  if (!bodySuccess) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: bodyError?.issues[0]?.message ?? "Invalid request",
    });
    return;
  }
  if (data.id === 1) {
    callback({
      code: status.PERMISSION_DENIED,
      details: "Cannot delete admin user",
    });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: data.id, deleted: false },
      data: {
        deleted: true,
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
