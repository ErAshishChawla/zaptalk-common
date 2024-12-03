import { Request, Response, NextFunction } from "express";

import { AccessTokenExpiredError } from "../utils/errors/access-token-expired-error";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req?.currentUser) {
    throw new AccessTokenExpiredError();
  }

  next();
}
