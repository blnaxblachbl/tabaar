// Original file: src/grpc/protos/product.proto

import type { LocaleContent as _LocaleContent, LocaleContent__Output as _LocaleContent__Output } from './LocaleContent';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';

export interface CreateProductRequest {
  'name'?: (_LocaleContent)[];
  'description'?: (_LocaleContent)[];
  'characterstics'?: (_google_protobuf_Struct | null);
}

export interface CreateProductRequest__Output {
  'name'?: (_LocaleContent__Output)[];
  'description'?: (_LocaleContent__Output)[];
  'characterstics'?: (_google_protobuf_Struct__Output);
}
