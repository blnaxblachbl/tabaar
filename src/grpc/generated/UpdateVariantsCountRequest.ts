// Original file: src/grpc/protos/product.proto


export interface _UpdateVariantsCountRequest_UpdateVariantsCountRequestData {
  'id'?: (string);
  'variantId'?: (string);
  'value'?: (number);
}

export interface _UpdateVariantsCountRequest_UpdateVariantsCountRequestData__Output {
  'id'?: (string);
  'variantId'?: (string);
  'value'?: (number);
}

export interface UpdateVariantsCountRequest {
  'data'?: (_UpdateVariantsCountRequest_UpdateVariantsCountRequestData)[];
}

export interface UpdateVariantsCountRequest__Output {
  'data'?: (_UpdateVariantsCountRequest_UpdateVariantsCountRequestData__Output)[];
}
