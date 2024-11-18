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
