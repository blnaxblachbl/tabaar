// Original file: src/grpc/protos/apiKey.proto


export interface _UpdateApiKeyRequest_UpdateApiKeyRequestData {
  'name'?: (string);
  'expiredAt'?: (string);
  '_name'?: "name";
  '_expiredAt'?: "expiredAt";
}

export interface _UpdateApiKeyRequest_UpdateApiKeyRequestData__Output {
  'name'?: (string);
  'expiredAt'?: (string);
}

export interface UpdateApiKeyRequest {
  'id'?: (number);
  'data'?: (_UpdateApiKeyRequest_UpdateApiKeyRequestData | null);
}

export interface UpdateApiKeyRequest__Output {
  'id'?: (number);
  'data'?: (_UpdateApiKeyRequest_UpdateApiKeyRequestData__Output);
}
