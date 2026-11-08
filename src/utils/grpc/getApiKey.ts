import { type Metadata, status } from "@grpc/grpc-js";

import { getApiKey } from "#utils/cache";
import { ApiKeyCache } from "#utils/cache/types";

export async function getApiKeyFromGrpc(metadata: Metadata): Promise<{
  apiKeyData: ApiKeyCache | null;
  success: boolean;
  error: string | null;
  code: status;
}> {
  const [apiKey] = metadata.get("api-key");
  if (!apiKey) {
    return {
      apiKeyData: null,
      success: false,
      error: "No API key provided",
      code: status.UNAUTHENTICATED,
    };
  }
  const keyData = await getApiKey(apiKey as string);
  if (!keyData) {
    return {
      apiKeyData: null,
      success: false,
      error: "Invalid API key",
      code: status.PERMISSION_DENIED,
    }
  }
  if (keyData.expiredAt.getTime() < Date.now()) {
    return {
      apiKeyData: null,
      success: false,
      error: "API key expired",
      code: status.PERMISSION_DENIED,
    }
  }

  return {
    apiKeyData: keyData,
    success: true,
    error: null,
    code: status.OK,
  }
}
