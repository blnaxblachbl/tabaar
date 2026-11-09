import type { Request, Response } from "express";

import { searchSchema } from "#utils/zod-schemas/skip-take";
import { INDEXES } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { filtersSchema } from "#utils/zod-schemas/products";
import { getProductsQuery } from "#utils/elastic/functions";

export const getProducts = async (req: Request, res: Response) => {
  const { success, data, error } = searchSchema.safeParse(req.query);
  if (!success) {
    return res.status(400).json({
      message: error?.issues[0]?.message ?? "Invalid query parameters",
    });
  }
  const { query, take } = data;
  const {
    success: filtersSuccess,
    data: filtersData,
    error: filtersError,
  } = filtersSchema.safeParse(req.body);
  if (!filtersSuccess) {
    return res.status(400).json({
      message: filtersError?.issues[0]?.message ?? "Invalid filters",
    });
  }
  const productQuery = getProductsQuery(filtersData);

  try {
    const result = await elasticSearch.search<ProductIndex>({
      index: INDEXES.PRODUCTS,
      q: query,
      query: productQuery,
      size: take,
      sort: [{ createdAt: "desc" }, { id: "desc" }],
      fields: ["min_price", "max_price", "available"],
      rest_total_hits_as_int: true,
      scroll: "3m",
    });
    return res.status(200).json({
      products: result.hits.hits.map((hit) => ({
        ...hit._source,
        minPrice: hit.fields?.min_price[0] ?? 0,
        maxPrice: hit.fields?.max_price[0] ?? 0,
        available: hit.fields?.available[0] ?? false,
      })),
      productsCount: result.hits.total,
      scrollId: result._scroll_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
