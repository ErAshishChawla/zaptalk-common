import { IApiError, ErrorTypes } from "../../types";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  message: string = "Not Found";

  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): IApiError {
    return {
      type: ErrorTypes.NOT_FOUND,
      payload: [{ message: this.message }],
    };
  }
}
