import { Characterstic } from "#graphql/Scalars/Characteristic/types";

export type FiltersInput = {
  available?: boolean;
  deleted?: boolean;
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
