import { rule } from "graphql-shield";
import { GraphQLError, GraphQLResolveInfo } from "graphql";

import { Context } from "#utils/context";
import { Verify } from "#utils/token/types";

function checkToken(verify: Verify | null, checkExpired: boolean = true) {
  if (!verify) {
    return new GraphQLError("Unauthorized");
  }
  if (verify?.expired === true && checkExpired) {
    return new GraphQLError("Token expired", {
      extensions: {
        code: "TOKEN_EXPIRED",
      },
    });
  }
  return true;
}

export const rules = {
  isAuthorized: rule({ cache: "contextual" })(
    (_parent, _args, { verify }: Context, info: GraphQLResolveInfo) => {
      return checkToken(verify, info.fieldName !== "refreshToken");
    },
  ),
};
