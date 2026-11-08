import jwt from "jsonwebtoken";

import { ENV } from "#utils/config";
import type { AllTokens, Verify } from "./types";

export function generateAccessToken(data: Verify): string {
  const accessToken: string = jwt.sign(data, ENV.ACCESS_TOKEN_SECRET, {
    // expiresIn: "5m",
    expiresIn: ENV.IS_DEV ? "1h" : "5m",
  });
  return accessToken;
}
export function generateRefreshToken(data: Verify): string {
  const accessToken: string = jwt.sign(data, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return accessToken;
}

export function generateAllTokens(data: Verify): AllTokens {
  const accessToken: string = generateAccessToken(data);
  const refreshToken: string = generateRefreshToken(data);
  return {
    accessToken,
    refreshToken,
  };
}
