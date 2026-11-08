// Original file: src/grpc/protos/product.proto

import type { Product as _Product, Product__Output as _Product__Output } from './Product';

export interface ScrollProductsResponse {
  'products'?: (_Product)[];
  'productsCount'?: (number);
  'scrollId'?: (string);
}

export interface ScrollProductsResponse__Output {
  'products'?: (_Product__Output)[];
  'productsCount'?: (number);
  'scrollId'?: (string);
}
