// Original file: src/grpc/protos/product.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';

export interface _UpdateVariantRequest_UpdateVariantData {
  'id'?: (string);
  'characterstics'?: (_google_protobuf_Struct | null);
  'price'?: (number | string);
  'count'?: (number);
  'currency'?: (string);
  '_characterstics'?: "characterstics";
  '_price'?: "price";
  '_count'?: "count";
  '_currency'?: "currency";
}

export interface _UpdateVariantRequest_UpdateVariantData__Output {
  'id'?: (string);
  'characterstics'?: (_google_protobuf_Struct__Output);
  'price'?: (number);
  'count'?: (number);
  'currency'?: (string);
}

export interface UpdateVariantRequest {
  'id'?: (string);
  'data'?: (_UpdateVariantRequest_UpdateVariantData | null);
}

export interface UpdateVariantRequest__Output {
  'id'?: (string);
  'data'?: (_UpdateVariantRequest_UpdateVariantData__Output);
}
