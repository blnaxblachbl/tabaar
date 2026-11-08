import { handleUnaryCall, status } from "@grpc/grpc-js";

import { GetUsersRequest } from "#grpc/generated/GetUsersRequest";
import { GetUsersResponse } from "#grpc/generated/GetUsersResponse";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { skipTakeSchema } from "#utils/zod-schemas/skip-take";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { USER_FIELDS } from "./constants";

export const getUsers: handleUnaryCall<
  GetUsersRequest,
  GetUsersResponse
> = async (call, callback) => {
  const {
    success: apiKeySuccess,
    error: apiKeyError,
    code,
  } = await getApiKeyFromGrpc(call.metadata);

  if (!apiKeySuccess) {
    callback({
      code,
      details: apiKeyError ?? "Something went wrong",
    });
    return;
  }

  const { success, data, error } = skipTakeSchema.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }

  const where: Prisma.UserWhereInput = {
    deleted: { equals: false },
  };
  const [users, usersCount] = await Promise.all([
    prisma.user
      .findMany({
        where,
        select: USER_FIELDS,
        skip: data.skip,
        take: data.take,
        orderBy: { createdAt: "desc" },
      })
      .then((users) =>
        users.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
      ),
    prisma.user.count({ where }),
  ]);
  callback(null, {
    users,
    usersCount: usersCount,
  });
};
