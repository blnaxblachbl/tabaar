// Original file: src/grpc/protos/apiKey.proto

import type { ApiKey as _ApiKey, ApiKey__Output as _ApiKey__Output } from './ApiKey';

export interface GetApiKeysResponse {
  'apiKeys'?: (_ApiKey)[];
  'apiKeysCount'?: (number);
}

export interface GetApiKeysResponse__Output {
  'apiKeys'?: (_ApiKey__Output)[];
  'apiKeysCount'?: (number);
}
