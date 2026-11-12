import { Characterstic } from "#graphql/Scalars/Characteristic/types";
import { ShieldedResolver, Resolver } from "#graphql/types";
import {
  ProductFields,
  VariantFields,
  ProductFull,
} from "#utils/elastic/types";

export type ProductResolvers = {
  Query: {
    findProducts: Resolver<null, FindProductsArgs, ProductResult>;
    scrollProducts: Resolver<null, ScrollProductsArgs, ProductResult>;
    findOneProduct: Resolver<null, FindOneProductArgs, ProductFull>;
    findDeletedProducts: ShieldedResolver<
      null,
      FindProductsArgs,
      ProductResult
    >;
    scrollDeletedProducts: ShieldedResolver<
      null,
      ScrollProductsArgs,
      ProductResult
    >;
  };
  Mutation: {
    createProduct: ShieldedResolver<null, CreateProductArgs, ProductFull>;
    updateProduct: ShieldedResolver<null, UpdateProductArgs, ProductFull>;
    deleteProduct: ShieldedResolver<null, DeleteProductArgs, ProductFull>;
    restoreProduct: ShieldedResolver<null, RestoreProductArgs, ProductFull>;
    appendVariant: ShieldedResolver<null, AppendVariantArgs, ProductFull>;
    deleteVariant: ShieldedResolver<null, DeleteVariantArgs, ProductFull>;
    updateVariant: ShieldedResolver<null, UpdateVariantArgs, ProductFull>;
  };
};

type UpdateProductArgs = {
  id: string;
  data: Partial<ProductFields>;
  select?: ProdcutSelect;
};

type DeleteProductArgs = {
  id: string;
  select?: ProdcutSelect;
};
type RestoreProductArgs = {
  id: string;
  select?: ProdcutSelect;
};

type DeleteVariantArgs = {
  id: string;
  variantId: string;
  select?: ProdcutSelect;
};

type AppendVariantArgs = {
  id: string;
  data: VariantFields;
  select?: ProdcutSelect;
};

type UpdateVariantArgs = {
  id: string;
  variantId: string;
  data: Partial<VariantFields>;
  select?: ProdcutSelect;
};

type CreateProductArgs = {
  data: ProductFields;
  select?: ProdcutSelect;
};

type FindOneProductArgs = {
  id: string;
  select?: ProdcutSelect;
};
type ScrollProductsArgs = {
  scrollId: string;
};
type FindProductsArgs = {
  query?: string;
  take?: number;
  filters?: FiltersInput;
  select?: {
    products?: {
      select: ProdcutSelect;
    };
    productsCount?: boolean;
    scrollId?: boolean;
  };
};
export type FiltersInput = {
  available?: boolean;
  minPrice?: {
    lte?: number;
    gte?: number;
  };
  maxPrice?: {
    lte?: number;
    gte?: number;
  };
  characterstics?: Characterstic;
  variants?: {
    currency?: string;
    characterstics?: Characterstic;
    count?: {
      lte?: number;
      gte?: number;
    };
    price?: {
      lte?: number;
      gte?: number;
    };
  };
};
type ProdcutSelect = {
  id?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  name?: boolean;
  description?: boolean;
  characterstics?: boolean;
  variants?: boolean;
};

export type ProductResult = {
  products: ProductFull[];
  productsCount: number;
  scrollId: string;
};
