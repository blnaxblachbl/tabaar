import type { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";

import { elasticSearch } from "#utils/elastic";
import { INDEXES, ProductIndex } from "#utils/elastic/types";
import { bulkCreateSchema } from "#utils/zod-schemas/products";
import { ENV } from "#utils/config";

export async function bulkCreate(req: Request, res: Response) {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ message: "File not privided" });
  }
  const json = JSON.parse(file.buffer.toString());
  const { success, data, error } = bulkCreateSchema.safeParse(json);
  if (!success) {
    return res.status(400).json({
      message: error.issues[0]?.message ?? "Unacceptable JSON",
    });
  }
  const operations = data.flatMap((doc) => {
    const _id = createId();
    const now = new Date().toISOString();
    return [
      { index: { _index: INDEXES.PRODUCTS, _id } },
      {
        ...doc,
        id: _id,
        variants: doc.variants.map((v) => ({
          ...v,
          id: createId(),
          createdAt: now,
          updatedAt: now,
          images: [],
        })),
      },
    ];
  });
  try {
    const bulkResponse = await elasticSearch.bulk<
      ProductIndex,
      Partial<ProductIndex>
    >({
      refresh: true,
      operations,
    });
    if (bulkResponse.errors) {
      // const erroredDocuments: unknown[] = [];
      // bulkResponse.items.forEach((action, i) => {
      //   const operation = Object.keys(action)[0];
      //   if (action[operation].error) {
      //     erroredDocuments.push({
      //       status: action[operation].status,
      //       error: action[operation].error,
      //       operation: operations[i * 2],
      //       document: operations[i * 2 + 1],
      //     });
      //   }
      // });
      return res.status(400).json({ message: "Unacceptable JSON" });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
}
