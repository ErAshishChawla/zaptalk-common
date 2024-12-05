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

export const EventRetryLimits = {
  [EventQueue.authQueue]: 5,
};

// In minutes
export const EventLockDurationInMin = {
  [EventQueue.authQueue]: 5,
};

export const jobSchedules = {
  [EventQueue.authQueue]: "*/5 * * * * *",
};

export interface IBaseEvent<D = any> {
  id: number;
  queue: EventQueue;
  topic: EventTopic;
  payload: D;
  status: EventStatus;
  retryCount: number;
  lockExpiration: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthServiceEvent extends IBaseEvent<IUserPayload> {}
