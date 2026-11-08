import type { Request, Response } from "express";

import { scrollSchema } from "#utils/zod-schemas/skip-take";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";

export const getProductsByScrollId = async (req: Request, res: Response) => {
  const { success, data, error } = scrollSchema.safeParse(req.query);
  if (!success) {
    return res.status(400).json({
      message: error?.issues[0]?.message ?? "Invalid query parameters",
    });
  }
  const { scrollId } = data;

  try {
    const result = await elasticSearch.scroll<ProductIndex>({
      scroll: "3m",
      scroll_id: scrollId,
      rest_total_hits_as_int: true,
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
