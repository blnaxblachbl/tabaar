// Original file: src/grpc/protos/product.proto

import type { ProductsFilter as _ProductsFilter, ProductsFilter__Output as _ProductsFilter__Output } from './ProductsFilter';

export interface GetProductsRequest {
  'query'?: (string);
  'take'?: (number);
  'filters'?: (_ProductsFilter | null);
  '_query'?: "query";
  '_take'?: "take";
  '_filters'?: "filters";
}

export interface GetProductsRequest__Output {
  'query'?: (string);
  'take'?: (number);
  'filters'?: (_ProductsFilter__Output);
}
