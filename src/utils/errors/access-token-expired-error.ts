import { CustomError } from "./custom-error";
import { IApiError, ErrorTypes } from "../../types";

export class AccessTokenExpiredError extends CustomError {
  statusCode = 401;

  constructor() {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, AccessTokenExpiredError.prototype);
  }

  serializeError(): IApiError {
    return {
      type: ErrorTypes.ACCESS_TOKEN_EXPIRED_ERROR,
      payload: [
        {
          message: "Access token expired",
        },
      ],
    };
  }
}
