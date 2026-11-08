import type { Request, Response } from "express";

import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { updateProductSchema } from "#utils/zod-schemas/products";
import { elasticSearch } from "#utils/elastic";
import { INDEXES } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import type { ProductIndex } from "#utils/elastic/types";

export async function updateProductById(req: Request, res: Response) {
  const {
    data: params,
    success,
    error,
  } = stringIdInParams.safeParse(req.params);
  if (!success) {
    return res.status(400).json({
      message: error?.issues[0]?.message ?? "Invalid query parameters",
    });
  }
  const { id } = params;
  const {
    data: body,
    success: bodySuccess,
    error: bodyError,
  } = updateProductSchema.safeParse(req.body);
  if (!bodySuccess) {
    return res.status(400).json({
      message: bodyError?.issues[0]?.message ?? "Invalid request body",
    });
  }
  try {
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      doc: body,
      _source: true,
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      return res.status(500).json({
        message: "Failed to update product",
      });
    }
    return res.status(200).json(parseSource(result.get._source));
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update product",
    });
  }
}
