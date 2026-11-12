import type { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";

import { stringIdInParams } from "#utils/zod-schemas/id-params";
import { appendVariantSchema } from "#utils/zod-schemas/products";
import { INDEXES, ProductIndex, VariantIndex } from "#utils/elastic/types";
import { elasticSearch } from "#utils/elastic";
import { parseSource } from "#utils/elastic/functions";

export async function appendVariant(req: Request, res: Response) {
  const {
    success,
    error,
    data: params,
  } = stringIdInParams.safeParse(req.params);
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid product id" });
  }
  const { id } = params;
  const {
    success: bodySuccess,
    error: bodyError,
    data: bodyData,
  } = appendVariantSchema.safeParse(req.body);
  if (!bodySuccess) {
    return res.status(400).json({
      message: bodyError?.issues[0]?.message ?? "Invalid variant data",
    });
  }
  try {
    const variant: VariantIndex = {
      id: createId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      images: [],
      ...bodyData,
    };
    const exist = await elasticSearch.get<ProductIndex>({
      id,
      index: INDEXES.PRODUCTS,
    });
    if (!exist.found || exist._source?.deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      script: {
        source: "ctx._source.variants.add(params.variant)",
        lang: "painless",
        params: {
          variant,
        },
      },
      _source: {
        exclude: "deleted",
      },
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      return res.status(500).json({ message: "Failed to create variant" });
    }
    return res.status(200).json(parseSource(result.get._source));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
