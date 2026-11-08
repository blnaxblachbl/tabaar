import { Product__Output, Product } from "#grpc/generated/Product";
import { ProductIndex, VariantIndex } from "#utils/elastic/types";
import { createGoogleStruct, parseStruct } from "#utils/grpc/google";

export function createGrpcProduct(product: ProductIndex): Product__Output {
  return {
    ...product,
    characterstics: product.characterstics
      ? createGoogleStruct(product.characterstics)
      : undefined,
    variants: product.variants?.map((variant) => {
      return {
        ...variant,
        characterstics: variant.characterstics
          ? createGoogleStruct(variant.characterstics)
          : undefined,
      };
    }),
  };
}
export function parseGrpcProduct(
  grpcProduct: Product,
): Omit<ProductIndex, "deleted"> {
  return {
    ...(grpcProduct as ProductIndex),
    characterstics: grpcProduct.characterstics
      ? parseStruct(grpcProduct.characterstics)
      : undefined,
    variants: (grpcProduct.variants ?? []).map((variant) => {
      return {
        ...(variant as VariantIndex),
        characterstics: variant.characterstics
          ? parseStruct(variant.characterstics)
          : undefined,
      };
    }),
  };
}
