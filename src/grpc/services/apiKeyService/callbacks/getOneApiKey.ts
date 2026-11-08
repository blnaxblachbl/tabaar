import { handleUnaryCall, status } from "@grpc/grpc-js";

import { GetOneApiKeyRequest } from "#grpc/generated/GetOneApiKeyRequest";
import { GetOneApiKeyResponse } from "#grpc/generated/GetOneApiKeyResponse";
import { prisma } from "#utils/prisma";
import { idInParams } from "#utils/zod-schemas/id-params";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { API_KEY_FIELDS } from "./constants";

export const getOneApiKeys: handleUnaryCall<
  GetOneApiKeyRequest,
  GetOneApiKeyResponse
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

  const { success, data, error } = idInParams.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }

  const apiKey = await prisma.apiKey
    .findUnique({
      where: { id: data.id },
      select: API_KEY_FIELDS,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (!apiKey) {
    callback({
      code: status.NOT_FOUND,
      details: "Api key not found",
    });
    return;
  }

  callback(null, {
    apiKey: {
      ...apiKey,
      createdAt: apiKey.createdAt.toISOString(),
      updatedAt: apiKey.updatedAt.toISOString(),
      expiredAt: apiKey.expiredAt?.toISOString(),
    },
  });
};
