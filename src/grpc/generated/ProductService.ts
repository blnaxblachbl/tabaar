// Original file: src/grpc/protos/product.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { AppendVariantRequest as _AppendVariantRequest, AppendVariantRequest__Output as _AppendVariantRequest__Output } from './AppendVariantRequest';
import type { AppendVariantResponse as _AppendVariantResponse, AppendVariantResponse__Output as _AppendVariantResponse__Output } from './AppendVariantResponse';
import type { CreateProductRequest as _CreateProductRequest, CreateProductRequest__Output as _CreateProductRequest__Output } from './CreateProductRequest';
import type { CreateProductResponse as _CreateProductResponse, CreateProductResponse__Output as _CreateProductResponse__Output } from './CreateProductResponse';
import type { DeleteProductRequest as _DeleteProductRequest, DeleteProductRequest__Output as _DeleteProductRequest__Output } from './DeleteProductRequest';
import type { DeleteProductResponse as _DeleteProductResponse, DeleteProductResponse__Output as _DeleteProductResponse__Output } from './DeleteProductResponse';
import type { DeleteVariantRequest as _DeleteVariantRequest, DeleteVariantRequest__Output as _DeleteVariantRequest__Output } from './DeleteVariantRequest';
import type { DeleteVariantResponse as _DeleteVariantResponse, DeleteVariantResponse__Output as _DeleteVariantResponse__Output } from './DeleteVariantResponse';
import type { GetOneProductRequest as _GetOneProductRequest, GetOneProductRequest__Output as _GetOneProductRequest__Output } from './GetOneProductRequest';
import type { GetOneProductResponse as _GetOneProductResponse, GetOneProductResponse__Output as _GetOneProductResponse__Output } from './GetOneProductResponse';
import type { GetProductsRequest as _GetProductsRequest, GetProductsRequest__Output as _GetProductsRequest__Output } from './GetProductsRequest';
import type { GetProductsResponse as _GetProductsResponse, GetProductsResponse__Output as _GetProductsResponse__Output } from './GetProductsResponse';
import type { ScrollProductsRequest as _ScrollProductsRequest, ScrollProductsRequest__Output as _ScrollProductsRequest__Output } from './ScrollProductsRequest';
import type { ScrollProductsResponse as _ScrollProductsResponse, ScrollProductsResponse__Output as _ScrollProductsResponse__Output } from './ScrollProductsResponse';
import type { UpdateProductRequest as _UpdateProductRequest, UpdateProductRequest__Output as _UpdateProductRequest__Output } from './UpdateProductRequest';
import type { UpdateProductResponse as _UpdateProductResponse, UpdateProductResponse__Output as _UpdateProductResponse__Output } from './UpdateProductResponse';
import type { UpdateVariantRequest as _UpdateVariantRequest, UpdateVariantRequest__Output as _UpdateVariantRequest__Output } from './UpdateVariantRequest';
import type { UpdateVariantResponse as _UpdateVariantResponse, UpdateVariantResponse__Output as _UpdateVariantResponse__Output } from './UpdateVariantResponse';

export interface ProductServiceDefinition {
  AppendVariant: MethodDefinition<_AppendVariantRequest, _AppendVariantResponse, _AppendVariantRequest__Output, _AppendVariantResponse__Output>
  CreateProduct: MethodDefinition<_CreateProductRequest, _CreateProductResponse, _CreateProductRequest__Output, _CreateProductResponse__Output>
  DeleteProduct: MethodDefinition<_DeleteProductRequest, _DeleteProductResponse, _DeleteProductRequest__Output, _DeleteProductResponse__Output>
  DeleteVariant: MethodDefinition<_DeleteVariantRequest, _DeleteVariantResponse, _DeleteVariantRequest__Output, _DeleteVariantResponse__Output>
  GetOneProduct: MethodDefinition<_GetOneProductRequest, _GetOneProductResponse, _GetOneProductRequest__Output, _GetOneProductResponse__Output>
  GetProducts: MethodDefinition<_GetProductsRequest, _GetProductsResponse, _GetProductsRequest__Output, _GetProductsResponse__Output>
  ScrollProducts: MethodDefinition<_ScrollProductsRequest, _ScrollProductsResponse, _ScrollProductsRequest__Output, _ScrollProductsResponse__Output>
  UpdateProduct: MethodDefinition<_UpdateProductRequest, _UpdateProductResponse, _UpdateProductRequest__Output, _UpdateProductResponse__Output>
  UpdateVariant: MethodDefinition<_UpdateVariantRequest, _UpdateVariantResponse, _UpdateVariantRequest__Output, _UpdateVariantResponse__Output>
}
