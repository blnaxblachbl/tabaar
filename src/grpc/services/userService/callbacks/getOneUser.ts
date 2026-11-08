import { handleUnaryCall, status } from "@grpc/grpc-js";

import { GetOneUserRequest } from "#grpc/generated/GetOneUserRequest";
import { GetOneUserResponse } from "#grpc/generated/GetOneUserResponse";
import { prisma } from "#utils/prisma";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { idInParams } from "#utils/zod-schemas/id-params";
import { USER_FIELDS } from "./constants";

export const getOneUser: handleUnaryCall<
  GetOneUserRequest,
  GetOneUserResponse
> = async (call, callback) => {
  const { success, error, code } = await getApiKeyFromGrpc(call.metadata);
  if (!success) {
    callback({ code, details: error ?? "Something went wrong" });
    return;
  }
  const {
    success: reqSuccess,
    data,
    error: reqError,
  } = idInParams.safeParse(call.request);
  if (!reqSuccess) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: reqError?.issues[0]?.message ?? "Invalid request",
    });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: data.id },
    select: USER_FIELDS,
  });
  if (!user) {
    callback({ code: status.NOT_FOUND, details: "User not found" });
    return;
  }
  callback(null, {
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  });
};
