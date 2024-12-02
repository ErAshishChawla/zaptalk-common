import { Request, Response, NextFunction } from "express";

import { AccessTokenExpiredError } from "../utils/errors/access-token-expired-error";

/**
 * Middleware to ensure that the user is authenticated.
 *
 * This middleware checks if the `currentUser` property is present on the request object.
 * If the `currentUser` is not present, it throws an `AccessTokenExpiredError`.
 * Otherwise, it calls the `next` middleware in the stack.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @throws {AccessTokenExpiredError} If the `currentUser` is not present on the request object.
 */
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
