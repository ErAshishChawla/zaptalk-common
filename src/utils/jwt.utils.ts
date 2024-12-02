/**
 * Decodes a JSON Web Token (JWT) and verifies its validity.
 *
 * @param token - The JWT string to be decoded and verified.
 * @param key - The secret key used to verify the JWT.
 * @returns An object containing the decoded payload and the verification status.
 *          If the token is valid, the payload will be of type `UserPayload` and the status will be `JWTVerifyStatus.SUCCESS`.
 *          If the token is expired, the payload will be `null` and the status will be `JWTVerifyStatus.EXPIRED`.
 *          If the token is invalid, the payload will be `null` and the status will be `JWTVerifyStatus.INVALID`.
 */
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
