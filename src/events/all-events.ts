import { IUserPayload } from "../types";

export enum EventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum EventTopic {
  userCreated = "user:created",
  userVerified = "user:verified",
  userResendVerification = "user:resend-verification",
}

export enum EventQueue {
  authQueue = "authQueue",
  notificationQueue = "notificationQueue",
}

export interface IBaseEvent {
  id: number;
  queue: EventQueue;
  topic: EventTopic;
  payload: any;
  status: EventStatus;
  lockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthServiceEvent {
  id: number;
  queue: EventQueue;
  topic: EventTopic;
  payload: IUserPayload;
  status: EventStatus;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}
