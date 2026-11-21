// Original file: src/grpc/protos/apiKey.proto


export interface GetApiKeysRequest {
  'skip'?: (number);
  'take'?: (number);
  'search'?: (string);
  'expired'?: (boolean);
  '_skip'?: "skip";
  '_take'?: "take";
  '_search'?: "search";
  '_expired'?: "expired";
}

export interface GetApiKeysRequest__Output {
  'skip'?: (number);
  'take'?: (number);
  'search'?: (string);
  'expired'?: (boolean);
}
