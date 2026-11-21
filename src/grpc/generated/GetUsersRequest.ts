// Original file: src/grpc/protos/user.proto


export interface GetUsersRequest {
  'skip'?: (number);
  'take'?: (number);
  'search'?: (string);
  'deleted'?: (boolean);
  '_skip'?: "skip";
  '_take'?: "take";
  '_search'?: "search";
  '_deleted'?: "deleted";
}

export interface GetUsersRequest__Output {
  'skip'?: (number);
  'take'?: (number);
  'search'?: (string);
  'deleted'?: (boolean);
}
