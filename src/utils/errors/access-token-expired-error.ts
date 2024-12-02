import { CustomError } from "./custom-error";
import { ApiError, ErrorTypes } from "../../types";

/**
 * Class representing an error when an access token has expired.
 * Extends the `CustomError` class.
 *
 * @extends {CustomError}
 *
 * @property {number} statusCode - The HTTP status code for access token expired error, which is 401.
 *
 * @constructor
 * Initializes a new instance of the AccessTokenExpiredError class.
 *
 * @method serializeError
 * Serializes the error into an ApiError object.
 *
 * @returns {ApiError} An object containing the error type and payload with the message "Access token expired".
 *
 */
export class AccessTokenExpiredError extends CustomError {
  statusCode = 401;

  constructor() {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, AccessTokenExpiredError.prototype);
  }

  serializeError(): ApiError {
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
