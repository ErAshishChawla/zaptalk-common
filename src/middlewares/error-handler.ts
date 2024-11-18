import { Request, Response, NextFunction } from "express";

import { CustomError } from "../utils/errors/custom-error";
import { apiResponse } from "../utils/api.utils";

import { ApiError, ErrorTypes } from "../types";

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
