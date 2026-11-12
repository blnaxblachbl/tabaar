import type { Request, Response } from "express";

import { elasticSearch } from "#utils/elastic";
import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { ProductIndex } from "#utils/elastic/types";
import { INDEXES } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";

export async function restoreProductById(req: Request, res: Response) {
  const {
    success,
    error,
    data: params,
  } = stringIdInParams.safeParse(req.params);
  if (!success) {
    return res.status(400).json({
      message: error?.issues[0]?.message ?? "Invalid query parameters",
    });
  }
  const { id } = params;
  try {
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      doc: { deleted: false },
      _source: {
        exclude: "deleted",
      },
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      return res.status(500).json({ message: "Failed to delete product" });
    }
    return res.status(200).json(parseSource(result.get._source));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
