import z from "zod";

export const userFiltersSchama = z.object({
  search: z.string("search should be string").optional(),
  deleted: z
    .enum(["true", "false"], "deleted should be true or false")
    .optional(),
});
