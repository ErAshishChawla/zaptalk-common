import { CustomError } from "./custom-error";

import { ApiError, ErrorTypes } from "../../types";

/**
 * Represents an unauthorized error that extends the CustomError class.
 * This error is used to indicate that a request was made by a user who is not authorized.
 *
 * @extends {CustomError}
 *
 * @property {number} statusCode - The HTTP status code for unauthorized errors (401).
 * @property {string} message - The error message indicating unauthorized access.
 * @property {ErrorTypes.UNAUTHORIZED} errorType - The type of error, set to UNAUTHORIZED.
 *
 * @constructor
 * Creates an instance of UnauthorizedError.
 *
 * @method serializeError
 * Serializes the error into an ApiError object.
 * @returns {ApiError} The serialized error object containing the error type and message.
 */
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
