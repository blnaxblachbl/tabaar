import z from "zod";

export const uploadBodySchema = z.object(
  {
    productId: z.string("productId is required"),
    variantId: z.string("variantId is required"),
  },
  "Upload data is required",
);

export const deleteBodySchema = z.object(
  {
    productId: z.string("productId is required"),
    variantId: z.string("variantIds are required"),
    images: z.array(
      z.string("image should be a string"),
      "images should be an array of string",
    ),
  },
  "Delete body is reqired",
);
