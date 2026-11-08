import { handleUnaryCall, status } from "@grpc/grpc-js";

import { CreateApiKeyRequest } from "#grpc/generated/CreateApiKeyRequest";
import { CreateApiKeyResponse } from "#grpc/generated/CreateApiKeyResponse";
import { prisma } from "#utils/prisma";
import { createApiKeySchema } from "#utils/zod-schemas/api-key";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { API_KEY_FIELDS } from "./constants";

export const createApiKey: handleUnaryCall<
  CreateApiKeyRequest,
  CreateApiKeyResponse
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

  const { success, data, error } = createApiKeySchema.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }

  try {
    const apiKey = await prisma.apiKey.create({
      data,
      select: API_KEY_FIELDS,
    });

    callback(null, {
      apiKey: {
        ...apiKey,
        createdAt: apiKey.createdAt.toISOString(),
        updatedAt: apiKey.updatedAt.toISOString(),
        expiredAt: apiKey.expiredAt?.toISOString(),
      },
    });
  } catch (e) {
    console.error(e);
    callback({
      code: status.INTERNAL,
      details: "Something went wrong",
    });
  }
};
