import type { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";

import { createProductSchema } from "#utils/zod-schemas/products";
import { ProductIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { INDEXES } from "#utils/elastic/types";

export async function createProduct(req: Request, res: Response) {
  const { success, error, data } = createProductSchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ error: error.issues[0].message ?? "Invalid input" });
  }
  const id = createId();

  const document: ProductIndex = {
    id,
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [],
    ...data,
  };

  try {
    const result = await elasticSearch.index<ProductIndex>({
      id,
      index: INDEXES.PRODUCTS,
      document,
    });
    if (!["created", "noop"].includes(result.result)) {
      return res.status(500).json({ error: "Failed to create product" });
    }
    return res
      .status(201)
      .json({ ...document, minPrice: 0, maxPrice: 0, available: false });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
