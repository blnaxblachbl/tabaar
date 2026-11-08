import { z } from "zod";

export const idInParams = z.object({
  id: z.preprocess(
    (s: string) => parseInt(s),
    z.number("Id is required and must be a number"),
  ),
});

export const stringIdInParams = z.object({
  id: z.string("Id is required and must be a string"),
});

export const variantIdInParams = z.intersection(
  stringIdInParams,
  z.object({
    variantId: z.string("Variant id is required and must be a string"),
  }),
);
