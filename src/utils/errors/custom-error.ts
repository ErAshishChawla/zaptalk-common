import { ApiError } from "../../types";

/**
 * Abstract class representing a custom error.
 * This class extends the built-in Error class and provides a structure for custom error handling.
 *
 * @abstract
 *
 * @property {number} statusCode - The HTTP status code for the error.
 *
 * @method serializeError - Serializes the error into an ApiError object.
 *
 * @extends {Error}
 *
 * @constructor
 * Initializes a new instance of the CustomError class.
 *
 * @method serializeError
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor() {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeError(): ApiError;
}
