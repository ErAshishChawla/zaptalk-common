import { Request, Response, NextFunction } from "express";

import { CustomError } from "../utils/errors/custom-error";
import { apiResponse } from "../utils/api.utils";

import { ApiError, ErrorTypes } from "../types";

/**
 * Middleware to handle errors in the application.
 *
 * @param err - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * If the error is an instance of `CustomError`, it sends a response with the status code and serialized error.
 * Otherwise, it sends a generic internal server error response.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(
      apiResponse({
        statusCode: err.statusCode,
        error: err.serializeError(),
      })
    );
  }

  const error: ApiError = {
    type: ErrorTypes.INTERNAL_SERVER_ERROR,
    payload: [{ message: "Something went wrong" }],
  };

  res.status(500).send(
    apiResponse({
      statusCode: 500,
      error,
    })
  );
}
