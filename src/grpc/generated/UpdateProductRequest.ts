// Original file: src/grpc/protos/product.proto

import type { LocaleContent as _LocaleContent, LocaleContent__Output as _LocaleContent__Output } from './LocaleContent';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';

export interface _UpdateProductRequest_UpdateProductRequestData {
  'name'?: (_LocaleContent)[];
  'description'?: (_LocaleContent)[];
  'characterstics'?: (_google_protobuf_Struct | null);
  '_characterstics'?: "characterstics";
}

export interface _UpdateProductRequest_UpdateProductRequestData__Output {
  'name'?: (_LocaleContent__Output)[];
  'description'?: (_LocaleContent__Output)[];
  'characterstics'?: (_google_protobuf_Struct__Output);
}

export interface UpdateProductRequest {
  'id'?: (string);
  'data'?: (_UpdateProductRequest_UpdateProductRequestData | null);
}

export interface UpdateProductRequest__Output {
  'id'?: (string);
  'data'?: (_UpdateProductRequest_UpdateProductRequestData__Output);
}
