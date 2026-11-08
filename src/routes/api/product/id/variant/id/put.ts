import type { Request, Response } from "express";

import { variantIdInParams } from "#utils/zod-schemas/id-params";
import { updateVariantSchema } from "#utils/zod-schemas/products";
import { elasticSearch } from "#utils/elastic";
import { ProductIndex } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { INDEXES } from "#utils/elastic/types";

export async function updateVariant(req: Request, res: Response) {
  const { success, error, data: params } = variantIdInParams.safeParse(req.params);
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid search pararms" });
  }
  const { variantId, id } = params;
  const {
    success: bodySuccess,
    error: bodyError,
    data: bodyData,
  } = updateVariantSchema.safeDecode(req.body);
  if (!bodySuccess) {
    return res.status(400).json({
      message: bodyError?.issues[0]?.message ?? "Invalid variant body",
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
      script: {
        source:
          "for (variant in ctx._source.variants) { if (variant.id == params.id) { variant.putAll(params.data) }}",
        lang: "painless",
        params: {
          id: variantId,
          data: bodyData,
        },
      },
      _source: true,
    });
    if (
      !result.get?._source ||
      !["updated", "noop"].includes(result.result)
    ) {
      console.error(result.result);
      return res.status(500).json({ message: "Failed to update variant" });
    }
    return res.status(200).json(parseSource(result.get._source));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
