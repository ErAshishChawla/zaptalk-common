import { ZodIssue } from "zod";
import { CustomError } from "./custom-error";
import { ApiError, ErrorTypes } from "../../types";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ZodIssue[]) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): ApiError {
    return {
      type: ErrorTypes.REQUEST_VALIDATION_ERROR,
      payload: this.errors.map((err) => {
        return {
          message: err.message,
          field: err.path.join("."),
        };
      }),
    };
  }
}
