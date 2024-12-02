import path from "path";
import morgan from "morgan";
import { createLogger, format, transports, Logger } from "winston";
import { Request, Response, NextFunction } from "express";
import DailyRotateFile from "winston-daily-rotate-file";

import { CustomError } from "./errors/custom-error";

import { ErrorTypes } from "../types";

const { combine, timestamp, json, colorize } = format;

/**
 * Custom format for console logging with colors.
 */
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} - ${timestamp}`;
  })
);

/**
 * Creates a Winston logger instance with console and daily rotate file transports.
 *
 * @param folderPath - The path to the folder where log files will be stored.
 * @returns A configured Winston logger instance.
 */
export const getWinstonLogger = (folderPath: string) => {
  return createLogger({
    level: "info",
    format: combine(colorize(), timestamp(), json()),
    transports: [
      new transports.Console({
        format: consoleLogFormat,
      }),
      new DailyRotateFile({
        filename: path.join(folderPath, "logs", "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ],
  });
};

/**
 * Custom Morgan tokens to log detailed request information.
 */
morgan.token("headers", (req) => JSON.stringify(req.headers));

/**
 * Custom Morgan format string.
 */
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms :headers";

/**
 * Creates a Morgan logger instance that logs request information using a Winston logger.
 *
 * @param winstonLogger - The Winston logger instance to use for logging.
 * @returns A configured Morgan logger instance.
 */
export const getMorganLogger = (winstonLogger: Logger) => {
  return morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          contentLength: message.split(" ")[3],
          responseTime: message.split(" ")[5],
          headers: message.split(" ")[7],
        };

        winstonLogger.info(JSON.stringify(logObject));
      },
    },
  });
};

/**
 * Middleware to log incoming requests using a Winston logger.
 *
 * @param winstonLogger - The Winston logger instance to use for logging.
 * @returns An Express middleware function.
 */
export const getRequestIncomingLogger = (winstonLogger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const commonRequestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    };

    winstonLogger.info(JSON.stringify(commonRequestData));
    next();
  };
};

/**
 * Middleware to log request errors using a Winston logger.
 *
 * @param winstonLogger - The Winston logger instance to use for logging.
 * @returns An Express error-handling middleware function.
 */
export const getRequestErrorLogger = (winstonLogger: Logger) => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const commonRequestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    };

    if (err instanceof CustomError) {
      const { payload, type } = err.serializeError();
      payload.forEach((e) => {
        winstonLogger.error(
          JSON.stringify({
            type,
            messsage: e.message,
            field: e.field,
            ...commonRequestData,
          })
        );
      });
    } else {
      winstonLogger.error(
        JSON.stringify({
          type: ErrorTypes.INTERNAL_SERVER_ERROR,
          message: err.message || "Something went wrong",
          ...commonRequestData,
        })
      );
    }

    next(err);
  };
};
