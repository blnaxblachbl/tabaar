import type { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";

import { uploadImage } from "#utils/minio/uploadFile";
import { uploadBodySchema } from "#utils/zod-schemas/upload";
import { elasticSearch } from "#utils/elastic";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { deleteFiles } from "#utils/minio/deleteFiles";

export async function uploadImages(req: Request, res: Response) {
  const { success, data, error } = uploadBodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0]?.message });
  }
  if (!req.files) {
    return res.status(400).json({ message: "Images filed are required" });
  }
  const { productId, variantId } = data;
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
  let images: string[] = [...variant.images];
  for (const file of req.files as Express.Multer.File[]) {
    const fileName = createId();
    await uploadImage(file.buffer, `${productId}/${variantId}/${fileName}`);
    images.push(fileName);
  }
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
        data: images,
      },
    },
    _source: false,
  });

  if (!["updated", "noop"].includes(esUploadResult.result)) {
    console.error(esUploadResult.result);
    await deleteFiles(
      images.map((item) => `${productId}/${variantId}/${item}`),
    );
    return res.status(404).json({ message: "Product update error" });
  }
  return res.status(200).json({ images });
}
