// Original file: src/grpc/protos/product.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';

export interface _AppendVariantRequest_AppendVariantData {
  'characterstics'?: (_google_protobuf_Struct | null);
  'price'?: (number | string);
  'count'?: (number);
  'currency'?: (string);
}

export interface _AppendVariantRequest_AppendVariantData__Output {
  'characterstics'?: (_google_protobuf_Struct__Output);
  'price'?: (number);
  'count'?: (number);
  'currency'?: (string);
}

export interface AppendVariantRequest {
  'id'?: (string);
  'data'?: (_AppendVariantRequest_AppendVariantData | null);
}

export interface AppendVariantRequest__Output {
  'id'?: (string);
  'data'?: (_AppendVariantRequest_AppendVariantData__Output);
}
