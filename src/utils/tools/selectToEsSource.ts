export function selectToEsSource(
  select: Record<string, boolean> | null | undefined,
  defaultFields?: string[] | undefined,
) {
  return select ? Object.keys(select) : defaultFields;
}
