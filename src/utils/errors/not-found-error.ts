import { ApiError, ErrorTypes } from "../../types";
import { CustomError } from "./custom-error";

/**
 * Represents a "Not Found" error, extending the `CustomError` class.
 * This error is used when a requested resource cannot be found.
 *
 * @extends CustomError
 *
 * @constructor
 * Initializes a new instance of the NotFoundError class.
 *
 * @method serializeError
 * Serializes the error into an ApiError object.
 *
 * @returns {ApiError} An object containing the error type and payload with the message "Not Found".
 *
 */
export class NotFoundError extends CustomError {
  statusCode = 404;
  message: string = "Not Found";

  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): ApiError {
    return {
      type: ErrorTypes.NOT_FOUND,
      payload: [{ message: this.message }],
    };
  }
}
