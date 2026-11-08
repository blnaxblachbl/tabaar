import {
  ServiceClientConstructor,
  loadPackageDefinition,
  Server,
} from "@grpc/grpc-js";
import { type PackageDefinition } from "@grpc/proto-loader";

import { getApiKeys } from "./callbacks/getApiKeys";
import { getOneApiKeys } from "./callbacks/getOneApiKey";
import { createApiKey } from "./callbacks/createApiKey";
import { updateApiKey } from "./callbacks/updateApiKey";
import { deleteApiKey } from "./callbacks/deleteApiKey";

export function addApiKeyService(
  server: Server,
  definition: PackageDefinition,
) {
  const proto = loadPackageDefinition(definition);

  server.addService((proto.ApiKeyService as ServiceClientConstructor).service, {
    GetApiKeys: getApiKeys,
    GetOneApiKey: getOneApiKeys,
    CreateApiKey: createApiKey,
    UpdateApiKey: updateApiKey,
    DeleteApiKey: deleteApiKey,
  });
}
