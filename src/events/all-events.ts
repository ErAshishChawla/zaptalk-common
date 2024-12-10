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
  retryLimit: number;
  timeoutMs: number;
  bufferMs: number;
  lockExpiration: DurationLikeObject;
  jobSchedule: string;
}

export type IEventQueueConfig = {
  [key in EventQueue]: IEventQueueConfigItem;
};

export const EventQueueConfig: IEventQueueConfig = {
  [EventQueue.authQueue]: {
    retryLimit: 5,
    timeoutMs: 30 * 1000,
    bufferMs: 30 * 1000,
    lockExpiration: {
      minutes: 1,
    },
    jobSchedule: "*/60 * * * * *",
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
