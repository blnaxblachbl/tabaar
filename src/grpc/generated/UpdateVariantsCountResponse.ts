// Original file: src/grpc/protos/product.proto


export interface _UpdateVariantsCountResponse_UpdateVariantsCountResponseData {
  'id'?: (string);
  'variantId'?: (string);
  'value'?: (number);
  'status'?: (string);
  'error'?: (string);
  '_error'?: "error";
}

export interface _UpdateVariantsCountResponse_UpdateVariantsCountResponseData__Output {
  'id'?: (string);
  'variantId'?: (string);
  'value'?: (number);
  'status'?: (string);
  'error'?: (string);
}

export interface UpdateVariantsCountResponse {
  'data'?: (_UpdateVariantsCountResponse_UpdateVariantsCountResponseData)[];
}

export interface UpdateVariantsCountResponse__Output {
  'data'?: (_UpdateVariantsCountResponse_UpdateVariantsCountResponseData__Output)[];
}
