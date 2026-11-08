// Original file: src/grpc/protos/product.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { FloatRangeInput as _FloatRangeInput, FloatRangeInput__Output as _FloatRangeInput__Output } from './FloatRangeInput';
import type { IntRangeInput as _IntRangeInput, IntRangeInput__Output as _IntRangeInput__Output } from './IntRangeInput';

export interface VariantFilterInput {
  'characterstics'?: (_google_protobuf_Struct | null);
  'currency'?: (string);
  'price'?: (_FloatRangeInput | null);
  'count'?: (_IntRangeInput | null);
  '_characterstics'?: "characterstics";
  '_currency'?: "currency";
  '_price'?: "price";
  '_count'?: "count";
}

export interface VariantFilterInput__Output {
  'characterstics'?: (_google_protobuf_Struct__Output);
  'currency'?: (string);
  'price'?: (_FloatRangeInput__Output);
  'count'?: (_IntRangeInput__Output);
}
