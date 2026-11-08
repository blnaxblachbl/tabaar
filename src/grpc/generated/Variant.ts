// Original file: src/grpc/protos/product.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';

export interface Variant {
  'id'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'characterstics'?: (_google_protobuf_Struct | null);
  'price'?: (number | string);
  'count'?: (number);
  'currency'?: (string);
  'images'?: (string)[];
}

export interface Variant__Output {
  'id'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'characterstics'?: (_google_protobuf_Struct__Output);
  'price'?: (number);
  'count'?: (number);
  'currency'?: (string);
  'images'?: (string)[];
}
