// Original file: src/grpc/protos/product.proto


export interface FloatRangeInput {
  'gte'?: (number | string);
  'lte'?: (number | string);
  '_gte'?: "gte";
  '_lte'?: "lte";
}

export interface FloatRangeInput__Output {
  'gte'?: (number);
  'lte'?: (number);
}
