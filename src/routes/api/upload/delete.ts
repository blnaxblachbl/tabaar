import type { Request, Response } from "express";

import { deleteBodySchema } from "#utils/zod-schemas/upload";
import { elasticSearch } from "#utils/elastic";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { deleteFiles } from "#utils/minio/deleteFiles";

export async function deleteImages(req: Request, res: Response) {
  const { success, data, error } = deleteBodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0]?.message });
  }
  const { productId, variantId, images } = data;
  const esResilt = await elasticSearch.get<ProductIndex>({
    id: productId,
    index: INDEXES.PRODUCTS,
    _source: ["variants"],
  });
  if (!esResilt.found) {
    return res.status(404).json({ message: "Product not found" });
  }
  const variant = esResilt._source?.variants.find((v) => v.id === variantId);
  if (!variant) {
    return res.status(404).json({ message: "Variant not found" });
  }
  let newImages: string[] = [
    ...variant.images.filter((image) => !images.includes(image)),
  ];
  const esUploadResult = await elasticSearch.update<
    ProductIndex,
    Partial<ProductIndex>,
    ProductIndex
  >({
    id: productId,
    index: INDEXES.PRODUCTS,
    script: {
      source:
        "for (variant in ctx._source.variants) { if (variant.id == params.id) { variant.images = params.data }}",
      lang: "painless",
      params: {
        id: variantId,
        data: newImages,
      },
    },
    _source: false,
  });
  if (!["updated", "noop"].includes(esUploadResult.result)) {
    console.error(esUploadResult.result);
    return res.status(404).json({ message: "Product update error" });
  }
  await deleteFiles(
    images.map((item) => `${productId}/${variantId}/${item}`),
  );
  return res.status(200).json({ images: newImages });
}
