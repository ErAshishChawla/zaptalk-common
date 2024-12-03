import { IApiResponse, IApiResponseAttrs } from "../types";

export function apiResponse<DataType = any>({
  statusCode,
  data,
  error,
}: IApiResponseAttrs<DataType>): IApiResponse<DataType> {
  return {
    success: statusCode >= 200 && statusCode < 300,
    data,
    statusCode,
    error,
  };
}
