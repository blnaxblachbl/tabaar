export function camelToSnake(key: string) {
  var result = key.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("_").toLowerCase();
}

export function objectKeysToSnake<T>(obj: Record<string, unknown>) {
  let result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result as T;
}
