import { Struct, Struct__Output } from "#grpc/generated/google/protobuf/Struct";
import { Value, Value__Output } from "#grpc/generated/google/protobuf/Value";

export function parseStruct(value: Struct): Record<string, any> {
  let res: Record<string, any> = {};
  for (const [key, val] of Object.entries(value.fields ?? {})) {
    res[key] = parseValue(val);
  }
  return res;
}
export function parseValue(val: Value): any {
  if (val.numberValue || val.stringValue || val.boolValue) {
    return val.numberValue ?? val.stringValue ?? val.boolValue;
  }
  if (val.structValue) {
    return parseStruct(val.structValue);
  }
  if (val.listValue) {
    return val.listValue.values?.map(parseValue) ?? [];
  }
  return null;
}
export function createGoogleStruct(
  value: Record<string, unknown>,
): Struct__Output {
  const fields: Record<string, Value__Output> = {};
  for (const [key, val] of Object.entries(value ?? {})) {
    fields[key] = createGoogleValue(val);
  }
  return {
    fields,
  };
}
export function createGoogleValue(value: unknown): Value__Output {
  if (typeof value === "number") {
    return { numberValue: value };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (typeof value === "boolean") {
    return { boolValue: value };
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return {
        listValue: {
          values: value.map(createGoogleValue),
        },
      };
    }
    return {
      structValue: createGoogleStruct(value as Record<string, unknown>),
    };
  }
  return { nullValue: 0 };
}
