import { GraphQLError } from "graphql";
import { estypes } from "@elastic/elasticsearch";

import { INDEXES, ProductIndex, VariantIndex } from "#utils/elastic/types";
import { ProductResolvers } from "#graphql/Product/types";

type ToUpdate = {
  id: string;
  variants: VariantIndex[];
  seq_no: number;
  primary_term: number;
};

type Response = Awaited<
  ReturnType<ProductResolvers["Mutation"]["updateVariantsCount"]>
>;

export const updateVariantsCount: ProductResolvers["Mutation"]["updateVariantsCount"] =
  async (
    _,
    { data, retryCount = 0 },
    { elasticSearch, ...varify },
    ...rest
  ) => {
    if (data.length === 0) {
      throw new GraphQLError("Data can not be an empty array");
    }
    const products: Record<string, typeof data> = data.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = [item];
      } else {
        acc[item.id].push(item);
      }
      return acc;
    }, {});

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
        throw new GraphQLError(`Products with ID- ${product._id} not found`);
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
          throw new GraphQLError(
            `Variant with id - ${variantId} not found in Product with id - ${product._id}`,
          );
        }
        const prevVariant = prevVariants[index];
        const nextCount = prevVariant.count + value;
        if (nextCount < 0) {
          throw new GraphQLError(
            `Variant with ID - ${prevVariant.id} out of stock, max count is ${prevVariant.count}`,
          );
        }
        prevVariants[index].count = nextCount;
      }

      nextProduct.variants = prevVariants;

      toUpdate.push(nextProduct);
    }

    const operations = toUpdate.flatMap((item) => [
      {
        update: {
          _index: INDEXES.PRODUCTS,
          _id: item.id,
          // if_seq_no: 1,
          // if_primary_term: 1,
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
    const result: Response = [];
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
      if (retryCount > 2) {
        return [
          ...result,
          ...conflict.map((c) => ({
            ...c,
            status: "error",
            error: "Update conflict",
          })),
        ];
      }
      return [
        ...result,
        ...(await updateVariantsCount(
          _,
          { data: conflict, retryCount: retryCount + 1 },
          { elasticSearch, ...varify },
          ...rest,
        )),
      ];
    }
    return result;
  };
