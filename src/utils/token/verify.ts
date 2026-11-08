import jwt from "jsonwebtoken";

import { ENV } from "#utils/config";
import type { Verify } from "./types";

export function verifyAccessToken(token: string): null | Verify {
  return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const decoded = jwt.decode(token);
        return {
          ...(decoded as Verify),
          expired: true,
        };
      }
      return null;
    }
    return decoded;
  }) as unknown as null | Verify;
}
export function verifyRefreshToken(token: string): null | Verify {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return null;
    }
    return decoded;
  }) as unknown as null | Verify;
}
