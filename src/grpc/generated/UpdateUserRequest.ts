// Original file: src/grpc/protos/user.proto


export interface _UpdateUserRequest_UpdateUserRequestData {
  'name'?: (string);
  'email'?: (string);
  '_name'?: "name";
  '_email'?: "email";
}

export interface _UpdateUserRequest_UpdateUserRequestData__Output {
  'name'?: (string);
  'email'?: (string);
}

export interface UpdateUserRequest {
  'id'?: (number);
  'data'?: (_UpdateUserRequest_UpdateUserRequestData | null);
}

export interface UpdateUserRequest__Output {
  'id'?: (number);
  'data'?: (_UpdateUserRequest_UpdateUserRequestData__Output);
}
