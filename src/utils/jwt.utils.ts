import jwt from "jsonwebtoken";

import { JWTVerifyStatus, UserPayload } from "../types";

export const decodeJWT = (token: string, key: string) => {
  try {
    const payload = jwt.verify(token, key) as UserPayload;

    return { payload, status: JWTVerifyStatus.SUCCESS };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { payload: null, status: JWTVerifyStatus.EXPIRED };
    }

    return { payload: null, status: JWTVerifyStatus.INVALID };
  }
};
