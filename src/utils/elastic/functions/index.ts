import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { FiltersInput } from "./types";
import { ProductFull, ProductIndex } from "../types";

export function parseSource(source: ProductIndex): ProductFull {
  const { variants } = source;
  if (variants.length === 0) {
    return {
      ...source,
      maxPrice: 0,
      minPrice: 0,
      available: false,
    };
  }
  const prices = variants.map((v) => v.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const available = variants.some((v) => v.count > 0);

  return {
    ...source,
    maxPrice,
    minPrice,
    available,
  };
}

export function getProductsQuery(
  filters?: FiltersInput,
  deleted: boolean = false,
): QueryDslQueryContainer {
  const filter: QueryDslQueryContainer[] = [
    {
      term: {
        deleted,
      },
    },
  ];
  if (filters?.available !== undefined) {
    filter.push({ term: { available: filters.available } });
  }
  if (filters?.minPrice) {
    filter.push({
      range: {
        min_price: filters.minPrice,
      },
    });
  }
  if (filters?.maxPrice) {
    filter.push({
      range: {
        max_price: filters.maxPrice,
      },
    });
  }
  if (filters?.characterstics) {
    for (const [key, value] of Object.entries(filters.characterstics)) {
      filter.push({
        term: {
          [`characterstics.${key}`]:
            typeof value === "string" ? value.toLocaleLowerCase() : value,
        },
      });
    }
  }
  if (filters?.variants) {
    const nestedFilters: QueryDslQueryContainer[] = [];
    if (filters.variants.currency) {
      nestedFilters.push({
        term: {
          "variants.currency": filters.variants.currency,
        },
      });
    }
    if (filters.variants.characterstics) {
      for (const [key, value] of Object.entries(
        filters.variants.characterstics,
      )) {
        nestedFilters.push({
          term: {
            [`variants.characterstics.${key}`]:
              typeof value === "string" ? value.toLocaleLowerCase() : value,
          },
        });
      }
    }
    if (filters.variants.count) {
      nestedFilters.push({
        range: {
          "variants.count": filters.variants.count,
        },
      });
    }
    if (filters.variants.price) {
      nestedFilters.push({
        range: {
          "variants.price": filters.variants.price,
        },
      });
    }
    filter.push({
      nested: {
        path: "variants",
        query: {
          bool: {
            should: nestedFilters,
          },
        },
      },
    });
  }
  return {
    bool: {
      filter,
    },
  };
}
