import jwt from "jsonwebtoken";

import { JWTVerifyStatus, IUserPayload } from "../types";

export const decodeJWT = (token: string, key: string) => {
  try {
    const payload = jwt.verify(token, key) as IUserPayload;

    return { payload, status: JWTVerifyStatus.SUCCESS };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { payload: null, status: JWTVerifyStatus.EXPIRED };
    }

    return { payload: null, status: JWTVerifyStatus.INVALID };
  }
};
