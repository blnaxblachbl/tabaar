// Original file: src/grpc/protos/product.proto

import type { LocaleContent as _LocaleContent, LocaleContent__Output as _LocaleContent__Output } from './LocaleContent';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Variant as _Variant, Variant__Output as _Variant__Output } from './Variant';

export interface Product {
  'id'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'name'?: (_LocaleContent)[];
  'description'?: (_LocaleContent)[];
  'characterstics'?: (_google_protobuf_Struct | null);
  'maxPrice'?: (number | string);
  'minPrice'?: (number | string);
  'available'?: (boolean);
  'variants'?: (_Variant)[];
}

export interface Product__Output {
  'id'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'name'?: (_LocaleContent__Output)[];
  'description'?: (_LocaleContent__Output)[];
  'characterstics'?: (_google_protobuf_Struct__Output);
  'maxPrice'?: (number);
  'minPrice'?: (number);
  'available'?: (boolean);
  'variants'?: (_Variant__Output)[];
}
