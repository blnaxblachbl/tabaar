// Original file: src/grpc/protos/apiKey.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateApiKeyRequest as _CreateApiKeyRequest, CreateApiKeyRequest__Output as _CreateApiKeyRequest__Output } from './CreateApiKeyRequest';
import type { CreateApiKeyResponse as _CreateApiKeyResponse, CreateApiKeyResponse__Output as _CreateApiKeyResponse__Output } from './CreateApiKeyResponse';
import type { DeleteApiKeyRequest as _DeleteApiKeyRequest, DeleteApiKeyRequest__Output as _DeleteApiKeyRequest__Output } from './DeleteApiKeyRequest';
import type { DeleteApiKeyResponse as _DeleteApiKeyResponse, DeleteApiKeyResponse__Output as _DeleteApiKeyResponse__Output } from './DeleteApiKeyResponse';
import type { GetApiKeysRequest as _GetApiKeysRequest, GetApiKeysRequest__Output as _GetApiKeysRequest__Output } from './GetApiKeysRequest';
import type { GetApiKeysResponse as _GetApiKeysResponse, GetApiKeysResponse__Output as _GetApiKeysResponse__Output } from './GetApiKeysResponse';
import type { GetOneApiKeyRequest as _GetOneApiKeyRequest, GetOneApiKeyRequest__Output as _GetOneApiKeyRequest__Output } from './GetOneApiKeyRequest';
import type { GetOneApiKeyResponse as _GetOneApiKeyResponse, GetOneApiKeyResponse__Output as _GetOneApiKeyResponse__Output } from './GetOneApiKeyResponse';
import type { UpdateApiKeyRequest as _UpdateApiKeyRequest, UpdateApiKeyRequest__Output as _UpdateApiKeyRequest__Output } from './UpdateApiKeyRequest';
import type { UpdateApiKeyResponse as _UpdateApiKeyResponse, UpdateApiKeyResponse__Output as _UpdateApiKeyResponse__Output } from './UpdateApiKeyResponse';

export interface ApiKeyServiceDefinition {
  CreateApiKey: MethodDefinition<_CreateApiKeyRequest, _CreateApiKeyResponse, _CreateApiKeyRequest__Output, _CreateApiKeyResponse__Output>
  DeleteApiKey: MethodDefinition<_DeleteApiKeyRequest, _DeleteApiKeyResponse, _DeleteApiKeyRequest__Output, _DeleteApiKeyResponse__Output>
  GetApiKeys: MethodDefinition<_GetApiKeysRequest, _GetApiKeysResponse, _GetApiKeysRequest__Output, _GetApiKeysResponse__Output>
  GetOneApiKey: MethodDefinition<_GetOneApiKeyRequest, _GetOneApiKeyResponse, _GetOneApiKeyRequest__Output, _GetOneApiKeyResponse__Output>
  UpdateApiKey: MethodDefinition<_UpdateApiKeyRequest, _UpdateApiKeyResponse, _UpdateApiKeyRequest__Output, _UpdateApiKeyResponse__Output>
}
