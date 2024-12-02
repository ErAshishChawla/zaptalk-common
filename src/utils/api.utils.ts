/**
 * Generates a standardized API response object.
 *
 * @template DataType - The type of the data being returned in the response.
 * @param {ApiResponseAttrs<DataType>} params - The parameters for the API response.
 * @param {number} params.statusCode - The HTTP status code of the response.
 * @param {DataType} [params.data] - The data to be included in the response.
 * @param {string} [params.error] - The error message, if any.
 * @returns {ApiResponse<DataType>} The standardized API response object.
 */
import { ApiResponse, ApiResponseAttrs } from "../types";

export function apiResponse<DataType = any>({
  statusCode,
  data,
  error,
}: ApiResponseAttrs<DataType>): ApiResponse<DataType> {
  return {
    success: statusCode >= 200 && statusCode < 300,
    data,
    statusCode,
    error,
  };
}
