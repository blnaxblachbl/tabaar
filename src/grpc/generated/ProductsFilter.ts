// Original file: src/grpc/protos/product.proto

import type { FloatRangeInput as _FloatRangeInput, FloatRangeInput__Output as _FloatRangeInput__Output } from './FloatRangeInput';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { VariantFilterInput as _VariantFilterInput, VariantFilterInput__Output as _VariantFilterInput__Output } from './VariantFilterInput';

export interface ProductsFilter {
  'deleted'?: (boolean);
  'available'?: (boolean);
  'minPrice'?: (_FloatRangeInput | null);
  'maxPrice'?: (_FloatRangeInput | null);
  'characterstics'?: (_google_protobuf_Struct | null);
  'variants'?: (_VariantFilterInput | null);
  '_deleted'?: "deleted";
  '_available'?: "available";
  '_minPrice'?: "minPrice";
  '_maxPrice'?: "maxPrice";
  '_characterstics'?: "characterstics";
  '_variants'?: "variants";
}

export interface ProductsFilter__Output {
  'deleted'?: (boolean);
  'available'?: (boolean);
  'minPrice'?: (_FloatRangeInput__Output);
  'maxPrice'?: (_FloatRangeInput__Output);
  'characterstics'?: (_google_protobuf_Struct__Output);
  'variants'?: (_VariantFilterInput__Output);
}
