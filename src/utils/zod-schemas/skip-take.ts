import z from "zod";

export const skipTakeSchema = z.object({
  skip: z.preprocess(
    (s: string | undefined) => (s ? parseInt(s) : undefined),
    z
      .number("Skip must be a number")
      .min(0, "Skip must be greater than or equal to 0")
      .max(10_000, "Take must be less than 10,000")
      .optional()
      .default(0),
  ),
  take: z.preprocess(
    (s: string | undefined) => (s ? parseInt(s) : undefined),
    z
      .number("Take must be a number")
      .min(1, "Take must be greater than or equal to 1")
      .max(10_000, "Take must be less than 10,000")
      .optional()
      .default(50),
  ),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  take: z.preprocess(
    (s: string | undefined) => (s ? parseInt(s) : undefined),
    z
      .number("Take must be a number")
      .min(1, "Take must be greater than or equal to 1")
      .max(10_000, "Take must be less than 10,000")
      .optional()
      .default(50),
  ),
});

export const scrollSchema = z.object({
  scrollId: z.string("Scroll Id is required"),
});
