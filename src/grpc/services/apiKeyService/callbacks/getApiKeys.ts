import { handleUnaryCall, status } from "@grpc/grpc-js";

import { GetApiKeysRequest } from "#grpc/generated/GetApiKeysRequest";
import { GetApiKeysResponse } from "#grpc/generated/GetApiKeysResponse";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { skipTakeSchema } from "#utils/zod-schemas/skip-take";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { API_KEY_FIELDS } from "./constants";

export const getApiKeys: handleUnaryCall<
  GetApiKeysRequest,
  GetApiKeysResponse
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

  const where: Prisma.ApiKeyWhereInput = {
    deleted: { equals: false },
  };
  const [apiKeys, apiKeysCount] = await Promise.all([
    prisma.apiKey
      .findMany({
        where,
        select: API_KEY_FIELDS,
        skip: data.skip,
        take: data.take,
        orderBy: { createdAt: "desc" },
      })
      .then((apiKeys) =>
        apiKeys.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          expiredAt: item.expiredAt?.toISOString(),
        })),
      ),
    prisma.apiKey.count({ where }),
  ]);
  callback(null, {
    apiKeys: apiKeys,
    apiKeysCount: apiKeysCount,
  });
};
