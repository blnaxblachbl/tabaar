import type { Request, Response } from "express";
import type { ConnectionRequestResponse } from "@elastic/elasticsearch";

import { elasticSearch } from "#utils/elastic";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { parseSource } from "#utils/elastic/functions";

export async function getProductById(req: Request, res: Response) {
  const { success, data, error } = stringIdInParams.safeParse(req.params);
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid product id" });
  }
  try {
    const result = await elasticSearch.get<ProductIndex>({
      id: data.id,
      index: INDEXES.PRODUCTS,
      _source_excludes: ["deleted"],
    });
    if (!result._source) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(parseSource(result._source));
  } catch (error) {
    console.error(error);
    if (error.meta?.statusCode === 404) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
