// Original file: src/grpc/protos/user.proto


export interface GetUsersRequest {
  'skip'?: (number);
  'take'?: (number);
  '_skip'?: "skip";
  '_take'?: "take";
}

export interface GetUsersRequest__Output {
  'skip'?: (number);
  'take'?: (number);
}
