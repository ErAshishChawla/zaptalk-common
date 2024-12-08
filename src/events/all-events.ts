import { DurationLikeObject } from "luxon";
import { IUserPayload } from "../types";

export enum EventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum EventTopic {
  userCreated = "user.created",
  userVerified = "user.verified",
  userResendVerification = "user.resend-verification",
}

export enum EventQueue {
  authQueue = "authQueue",
}

export interface IEventQueueConfigItem {
  eventRetryLimit: number;
  eventTimeoutMs: number;
  batchSize: number;
  cronJobBufferMs: number;
  lockExpiration: DurationLikeObject;
}

export type IEventQueueConfig = {
  [key in EventQueue]: IEventQueueConfigItem;
};

// Events are processed in batches and parallely.
export const EventQueueConfig: IEventQueueConfig = {
  [EventQueue.authQueue]: {
    eventRetryLimit: 5,
    // Processing timeout per event
    eventTimeoutMs: 5 * 1000,
    batchSize: 20,
    // Buffer time to wait run the next cron job
    cronJobBufferMs: 30 * 1000,
    lockExpiration: {
      minutes: 1,
    },
  },
};

export interface IKafkaEvent {
  topic: EventTopic;
  payload: any;
}

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
