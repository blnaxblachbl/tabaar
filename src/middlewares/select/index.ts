import type { IMiddleware } from "graphql-middleware";

import { Context } from "#utils/context";
import { PrismaSelect } from "#utils/tools/select";

export const prismaSelectMiddleware: IMiddleware<
  unknown,
  Context,
  Record<string, unknown>
> = async (resolve, root, args, context: Context, info) => {
  const result = new PrismaSelect(info).value;
  if (Object.keys(result.select).length > 0) {
    args = {
      ...args,
      ...result,
    };
  }
  return resolve(root, args, context, info);
};
