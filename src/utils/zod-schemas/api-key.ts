import z from "zod";

export const createApiKeySchema = z.object(
  {
    name: z.string("Name is required"),
    expiredAt: z.preprocess(
      (s: string) => new Date(s),
      z.date("Expired At is required"),
    ),
  },
  "Api Key data is required",
);
export const updateApiKeySchema = z.object(
  {
    name: z.string().optional(),
    expiredAt: z.preprocess(
      (val: string | undefined) => (val ? new Date(val) : undefined),
      z.date("ExpiredAt must be a valid date").optional(),
    ),
  },
  "Body is required",
);
