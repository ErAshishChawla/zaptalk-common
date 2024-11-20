import { CustomError } from "./custom-error";
import { ApiError, ErrorTypes } from "../../types";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError(): ApiError {
    return {
      type: ErrorTypes.BAD_REQUEST,
      payload: [
        {
          message: this.message,
        },
      ],
    };
  }
}
