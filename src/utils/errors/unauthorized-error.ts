import { CustomError } from "./custom-error";

import { ApiError, ErrorTypes } from "../../types";

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  message: string = "Unauthorized";
  errorType: ErrorTypes.UNAUTHORIZED = ErrorTypes.UNAUTHORIZED;

  constructor() {
    super();
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError(): ApiError {
    return {
      type: this.errorType,
      payload: [{ message: this.message }],
    };
  }
}
