import { GraphQLResolveInfo } from "graphql";

import { Context } from "#utils/context";
import { RequiredNonNullableObject } from "#utils/tools/types";

export type Resolver<P, A, R> = (
  parent: P,
  args: A,
  context: Omit<Context, 'apiKey'>,
  info: GraphQLResolveInfo,
) => Promise<R>;

export type ShieldedResolver<P, A, R> = (
  parent: P,
  args: A,
  context: Omit<RequiredNonNullableObject<Context>, "apiKey">,
  info: GraphQLResolveInfo,
) => Promise<R>;
