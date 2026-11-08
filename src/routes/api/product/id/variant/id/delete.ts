import type { Request, Response } from "express";

import { variantIdInParams } from "#utils/zod-schemas/id-params";
import { elasticSearch } from "#utils/elastic";
import { INDEXES } from "#utils/elastic/types";
import { parseSource } from "#utils/elastic/functions";
import { ProductIndex } from "#utils/elastic/types";
import { deleteFolder } from "#utils/minio/deleteFolder";

export async function deleteVariant(req: Request, res: Response) {
  const {
    success,
    data: params,
    error,
  } = variantIdInParams.safeParse(req.params);
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid product id" });
  }
  const { id, variantId } = params;

  try {
    const result = await elasticSearch.update<
      ProductIndex,
      Partial<ProductIndex>,
      ProductIndex
    >({
      id,
      index: INDEXES.PRODUCTS,
      script: {
        source: "ctx._source.variants.removeIf(v -> v.id == params.variantId)",
        lang: "painless",
        params: {
          variantId,
        },
      },
      _source: true,
    });
    if (!result.get?._source || !["updated", "noop"].includes(result.result)) {
      console.error(result.result);
      return res.status(500).json({ message: "Failed to delete variant" });
    }
    deleteFolder(`${id}/${variantId}`);
    return res.status(200).json(parseSource(result.get._source));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
