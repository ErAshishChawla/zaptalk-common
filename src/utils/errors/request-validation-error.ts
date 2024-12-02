import { ZodIssue } from "zod";
import { CustomError } from "./custom-error";
import { ApiError, ErrorTypes } from "../../types";

/**
 * Represents a request validation error.
 * Extends the CustomError class to provide additional functionality.
 */
export class RequestValidationError extends CustomError {
  /**
   * The HTTP status code for the error.
   */
  statusCode = 400;

  /**
   * Creates an instance of RequestValidationError.
   * @param errors - An array of ZodIssue objects representing validation errors.
   */
  constructor(private errors: ZodIssue[]) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  /**
   * Serializes the error into an ApiError object.
   * @returns An ApiError object containing the error type and payload.
   */
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
