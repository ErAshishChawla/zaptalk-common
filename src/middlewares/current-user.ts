import { Request, Response, NextFunction } from "express";

import { decodeJWT } from "../utils/jwt.utils";

import { JWTVerifyStatus } from "../types";

/**
 * Middleware to extract the current user from the session's access token.
 *
 * This middleware checks if there is an access token in the session. If an access token is found,
 * it decodes the token using the provided secret and attaches the decoded payload to the request
 * object as `currentUser`. If no access token is found or if the token is invalid, it simply calls
 * the next middleware in the stack.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 *
 * @returns Calls the next middleware function in the stack.
 */
export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.session?.accessToken;

  if (!accessToken) {
    return next();
  }

  const decodeJWTRes = decodeJWT(accessToken, process.env.ACCESS_TOKEN_SECRET!);

  if (decodeJWTRes.status === JWTVerifyStatus.SUCCESS) {
    req.currentUser = decodeJWTRes.payload;
  }

  next();
};
