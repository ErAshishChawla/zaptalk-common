import { Request, Response, NextFunction } from "express";

import { decodeJWT } from "../utils/jwt.utils";

import { JWTVerifyStatus } from "../types";

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
