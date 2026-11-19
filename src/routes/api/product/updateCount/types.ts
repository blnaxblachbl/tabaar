import type { VariantIndex } from "#utils/elastic/types";

export type ToUpdate = {
  id: string;
  variants: VariantIndex[];
  seq_no: number;
  primary_term: number;
};
export type Response = {
  id: string;
  variantId: string;
  value: number;
  status: string;
  error?: string;
};
