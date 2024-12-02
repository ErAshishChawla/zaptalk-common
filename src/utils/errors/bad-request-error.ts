import { CustomError } from "./custom-error";
import { ApiError, ErrorTypes } from "../../types";

/**
 * Represents a Bad Request Error.
 * This error is thrown when the request made by the client is invalid or cannot be processed.
 *
 * @extends {CustomError}
 *
 * @property {number} statusCode - The HTTP status code for bad request error, which is 400.
 *
 * @constructor
 * Initializes a new instance of the BadRequestError class.
 *
 * @param {string} message - The error message to be sent to the client.
 *
 * @method serializeError
 * Serializes the error into an ApiError object.
 *
 * @returns {ApiError} An object containing the error type and payload with the message provided.
 */
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
