import type { Request, Response } from "express";
import { estypes } from "@elastic/elasticsearch";

import { updateVariantsCountSchema } from "#utils/zod-schemas/products";
import { createContext } from "#utils/context";
import { INDEXES } from "#utils/elastic/types";
import { ProductIndex } from "#utils/elastic/types";
import { ToUpdate, Response as UpdateResponse } from "./types";

export async function updateVariantsCount(
  req: Request & { retryCount?: number; prevResult?: UpdateResponse[] },
  res: Response,
) {
  const { elasticSearch } = await createContext({ req, res });
  const { success, error, data } = updateVariantsCountSchema.safeParse(
    req.body,
  );
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid body" });
  }
  if (!req.retryCount) {
    req.retryCount = 0;
  }
  if (!req.prevResult) {
    req.prevResult = [];
  }

  const products = data.reduce(
    (acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = [item];
      } else {
        acc[item.id].push(item);
      }
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  const toUpdate: ToUpdate[] = [];

  const poductsResult = await elasticSearch.mget<ProductIndex>({
    index: INDEXES.PRODUCTS,
    ids: Object.keys(products),
    _source: true,
  });

  for (const product of poductsResult.docs as estypes.GetGetResult<ProductIndex>[]) {
    if (
      "error" in product ||
      !product.found ||
      product._source?.deleted ||
      !product._seq_no ||
      !product._primary_term
    ) {
      return res.status(400).json({
        message: `Products with ID- ${product._id} not found`,
      });
    }

    const prevVariants = product._source?.variants ?? [];
    const nextProduct: ToUpdate = {
      id: product._id,
      variants: [],
      seq_no: product._seq_no,
      primary_term: product._primary_term,
    };

    for (const { value, variantId } of products[product._id]) {
      const index = prevVariants.findIndex((pV) => pV.id === variantId);
      if (index < 0) {
        return res.status(400).json({
          message: `Variant with id - ${variantId} not found in Product with id - ${product._id}`,
        });
      }
      const prevVariant = prevVariants[index];
      const nextCount = prevVariant.count + value;
      if (nextCount < 0) {
        return res.status(400).json({
          message: `Variant with ID - ${prevVariant.id} out of stock, max count is ${prevVariant.count}`,
        });
      }
      prevVariants[index].count = nextCount;
    }

    nextProduct.variants = prevVariants;

    toUpdate.push(nextProduct);
  }

  const operations = toUpdate.flatMap((item, index) => [
    {
      update: {
        _index: INDEXES.PRODUCTS,
        _id: item.id,
        // if_seq_no: index === 0 ? item.seq_no : 1,
        // if_primary_term: index === 0 ? item.primary_term : 1,
        if_seq_no: item.seq_no,
        if_primary_term: item.primary_term,
      },
    },
    { doc: { variants: item.variants } },
  ]);
  const bulkResponse = await elasticSearch.bulk<
    ProductIndex,
    Partial<ProductIndex>
  >({
    refresh: true,
    operations,
    _source: true,
  });
  const conflict: typeof data = [];
  const result: UpdateResponse[] = req.prevResult;
  for (const item of bulkResponse.items) {
    const dataItems = data.filter((d) => d.id === item.update?._id);
    if (dataItems.length === 0) {
      continue;
    }

    if (item.update?.error) {
      if (item.update.status === 409) {
        conflict.push(...dataItems);
        continue;
      } else {
        result.push(
          ...dataItems.map((dItem) => ({
            ...dItem,
            status: "error",
            error: item.update?.error?.reason ?? "Unknown error",
          })),
        );
      }
    } else {
      result.push(
        ...dataItems.map((dItem) => ({
          ...dItem,
          status: "success",
        })),
      );
    }
  }
  if (conflict.length > 0) {
    if (req.retryCount > 2) {
      result.push(
        ...conflict.map((c) => ({
          ...c,
          status: "error",
          error: "Update conflict",
        })),
      );
    } else {
      req.body = conflict;
      req.retryCount += 1;
      req.prevResult = result;
      return await updateVariantsCount(req, res);
    }
  }
  return res.status(200).json(result);
}
