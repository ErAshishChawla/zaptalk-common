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

export const EventQueueConfig: {
  [key in EventQueue]: {
    retryLimit: number;
    timeout: DurationLikeObject;
    buffer: DurationLikeObject;
    lockExpiration: DurationLikeObject;
    jobSchedule: string;
  };
} = {
  [EventQueue.authQueue]: {
    retryLimit: 5,
    timeout: {
      seconds: 30,
    },
    buffer: {
      seconds: 30,
    },
    lockExpiration: {
      minutes: 1,
    },
    jobSchedule: "*/5 * * * * *",
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
