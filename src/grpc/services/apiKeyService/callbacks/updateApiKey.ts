import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";

import { UpdateApiKeyRequest } from "#grpc/generated/UpdateApiKeyRequest";
import { UpdateApiKeyResponse } from "#grpc/generated/UpdateApiKeyResponse";
import { prisma } from "#utils/prisma";
import { updateApiKeySchema } from "#utils/zod-schemas/api-key";
import { idInParams } from "#utils/zod-schemas/id-params";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { API_KEY_FIELDS } from "./constants";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";

const requestSchema = z.object({
  ...idInParams.shape,
  data: updateApiKeySchema,
});

export const updateApiKey: handleUnaryCall<
  UpdateApiKeyRequest,
  UpdateApiKeyResponse
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
  const {
    success,
    data: parseData,
    error,
  } = requestSchema.safeParse(call.request);

  if (!success) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: error.issues[0].message,
    });
    return;
  }
  const { id, data } = parseData;

  try {
    const apiKey = await prisma.apiKey.update({
      where: { id },
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
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        callback({
          code: status.NOT_FOUND,
          details: "Api key not found",
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
