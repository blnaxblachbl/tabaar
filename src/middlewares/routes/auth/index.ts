import type { Request, Response, NextFunction } from "express";

import { createContext } from "#utils/context";
import { getApiKey } from "#utils/cache";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const context = await createContext({ req, res });

  if (!context.apiKey && !context.verify) {
    return res.status(401).json({ message: "Api key or token not provided" });
  }
  if (context.apiKey) {
    const apiKeyValue = await getApiKey(context.apiKey);
    if (!apiKeyValue) {
      return res.status(401).json({ message: "Invalid API key" });
    }
    if (apiKeyValue.expiredAt.getTime() < Date.now()) {
      return res.status(401).json({ message: "API key expired" });
    }
  }
  if (context.verify && context.verify.expired) {
    return res.status(401).json({ message: "Token expired" });
  }

  next();
};
