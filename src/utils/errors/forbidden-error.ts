import { ApiError, ErrorTypes } from "../../types";
import { CustomError } from "./custom-error";

/**
 * Represents a Forbidden Error which extends the CustomError class.
 * This error is used to indicate that the request was valid, but the server is refusing action.
 *
 * @class ForbiddenError
 * @extends {CustomError}
 *
 * @property {number} statusCode - The HTTP status code for forbidden error, which is 403.
 *
 * @constructor
 * Initializes a new instance of the ForbiddenError class.
 *
 * @method serializeError
 * Serializes the error into an ApiError object.
 *
 * @returns {ApiError} An object containing the error type and payload with the message "Forbidden".
 */
export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor() {
    super();

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeError(): ApiError {
    return {
      type: ErrorTypes.FORBIDDEN,
      payload: [{ message: "Forbidden" }],
    };
  }
}
