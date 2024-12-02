// ----- ERROR TYPES -----
export enum ErrorTypes {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  REQUEST_VALIDATION_ERROR = "REQUEST_VALIDATION_ERROR",
  ACCESS_TOKEN_EXPIRED_ERROR = "ACCESS_TOKEN_EXPIRED",
  RESET_TOKEN_EXPIRED_ERROR = "REQUEST_TOKEN_EXPIRED",
}

export interface ErrorPayload {
  message: string;
  field?: string;
}

// ----- API RESPONSE TYPES -----
export interface ApiError {
  type: ErrorTypes;
  payload: ErrorPayload[];
}

export interface ApiResponseAttrs<DataType = any> {
  data?: DataType;
  error?: ApiError;
  statusCode: number;
}
export interface ApiResponse<DataType = any> {
  success: boolean;
  data?: DataType;
  error?: {
    type: ErrorTypes;
    payload: ErrorPayload[];
  };
  statusCode: number;
}

// ----- ENV TYPES -----
interface EnvKey {
  value?: string;
  required?: boolean;
}

export interface EnvKeys {
  [key: string]: EnvKey;
}

// ----- File Types -----
export enum FileUploadStatus {
  presignedUrlGenerated = "PRE_SIGNED_URL_GENERATED",
  uploadCompleted = "UPLOAD_COMPLETED",
  uploadFailed = "UPLOAD_FAILED",
}
// ----- User Types -----
export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

export interface UserPayload {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Roles;
  isVerified: boolean;
  isDeactivated: boolean;
  isRegistrationCompleted: boolean;
  avatar: string | null;
  profileDescription: string;
  createdAt: string;
  updatedAt: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload | null;
    }
  }
}

// ----- JWT Types -----

export enum JWTVerifyStatus {
  SUCCESS = "SUCCESS",
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
}

export interface JWTVerifyResponse {
  payload: UserPayload;
  status: JWTVerifyStatus;
}
