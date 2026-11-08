import type { Request, Response, NextFunction } from "express";

import { authMiddleware } from "../auth";

const ALLOWED_PATHS = ["/login", "/refresh-token"];

export const userRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (ALLOWED_PATHS.includes(req.path)) {
    return next();
  }
  authMiddleware(req, res, next);
};
