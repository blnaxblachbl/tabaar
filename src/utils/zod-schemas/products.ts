import z from "zod";

export const localeSchema = z.array(
  z.object(
    {
      locale: z.string("Locale is required"),
      content: z.string("Content is required"),
    },
    "Locale item is reqired",
  ),
  "Locales are required and should be an array",
);

export const createProductSchema = z.object(
  {
    name: localeSchema,
    description: localeSchema,
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
  },
  "Create data is required",
);

export const updateProductSchema = z.object(
  {
    name: localeSchema.optional(),
    description: localeSchema.optional(),
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
  },
  "Update data is required",
);

export const appendVariantSchema = z.object(
  {
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
    price: z.number("Price is required"),
    count: z.number("Count is required"),
    currency: z.string("Currency is required"),
  },
  "Append variant data is required",
);

export const updateVariantSchema = z.object(
  {
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
    price: z.number().optional(),
    count: z.number().optional(),
    currency: z.string().optional(),
  },
  "Update variant data is required",
);

export const filtersSchema = z
  .object({
    available: z.boolean().optional(),
    deleted: z.boolean().optional(),
    minPrice: z
      .object({
        lte: z.number().optional(),
        gte: z.number().optional(),
      })
      .optional(),
    maxPrice: z
      .object({
        lte: z.number().optional(),
        gte: z.number().optional(),
      })
      .optional(),
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
    variants: z
      .object({
        currency: z.string().optional(),
        characterstics: z
          .record(
            z.string(),
            z.union(
              [z.string(), z.number(), z.boolean()],
              "Characteristic value must be a string, number, or boolean",
            ),
          )
          .optional(),
        count: z
          .object({
            lte: z.number().optional(),
            gte: z.number().optional(),
          })
          .optional(),
        price: z
          .object({
            lte: z.number().optional(),
            gte: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional();

export const bulkCreateSchema = z.array(
  z.object({
    name: localeSchema,
    description: localeSchema,
    characterstics: z
      .record(
        z.string(),
        z.union(
          [z.string(), z.number(), z.boolean()],
          "Characteristic value must be a string, number, or boolean",
        ),
      )
      .optional(),
    variants: z.array(
      z.object({
        characterstics: z
          .record(
            z.string(),
            z.union(
              [z.string(), z.number(), z.boolean()],
              "Characteristic value must be a string, number, or boolean",
            ),
          )
          .optional(),
        price: z.number("Price is required"),
        count: z.number("Count is required"),
        currency: z.string("Currency is required"),
      }),
      "Variants should be an array",
    ),
  }),
  "File should contains array of prod",
);
