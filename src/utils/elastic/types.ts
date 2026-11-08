export type IndexDefault = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
};

export type VariantFields = {
  characterstics?: Record<string, any>;
  price: number;
  count: number;
  currency: string;
  images: string[];
};

export type VariantIndex = IndexDefault & VariantFields;

export type LocaleContent = {
  locale: string;
  content: string;
};

export type ProductFields = {
  name: LocaleContent[];
  description: LocaleContent[];
  characterstics?: Record<string, any>;
  variants: VariantIndex[];
};

export type ProductExtraFields = {
  maxPrice: number;
  minPrice: number;
  available: boolean;
};

export type ProductFull = ProductIndex & ProductExtraFields;

export type ProductIndex = IndexDefault & ProductFields;

export enum INDEXES {
  PRODUCTS = "tabaar_products",
}
