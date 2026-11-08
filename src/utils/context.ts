import { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { Request, Response } from "express";

import { prisma } from "#utils/prisma";
import { Verify } from "#utils/token/types";
import { verifyAccessToken } from "#utils/token/verify";
import { elasticSearch } from "./elastic";

export type Context = {
  prisma: typeof prisma;
  elasticSearch: typeof elasticSearch;
  req: Request;
  res: Response;
  apiKey: string | undefined;
  verify: Verify | null;
};

export const createContext = ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<Context> => {
  const { authorization } = req.headers;
  const apiKey = req.headers["x-api-key"] as string | undefined;
  let token = "";

  if (authorization) {
    token = authorization.replace("Bearer ", "") || "";
  }
  const verify = verifyAccessToken(token);

  return Promise.resolve({
    prisma,
    elasticSearch,
    req,
    res,
    apiKey,
    verify,
  });
};
