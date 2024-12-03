import { IApiError, ErrorTypes } from "../../types";
import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor() {
    super();

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeError(): IApiError {
    return {
      type: ErrorTypes.FORBIDDEN,
      payload: [{ message: "Forbidden" }],
    };
  }
}
