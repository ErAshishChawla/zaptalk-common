import { IUserPayload } from "../types";

//
export enum EventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum RMQQueue {
  authEventOutbox = "authEventOutbox",
}

export enum KafkaTopic {
  userCreated = "user.created",
  userVerified = "user.verified",
  userResendVerification = "user.resend-verification",
}

export interface IEvent<D = any> {
  queue: RMQQueue;
  topic: KafkaTopic;
  payload: D;
  uniqueKey: string;
}

export interface IEventOutbox<D = any> extends IEvent<D> {
  id: number;
  status: EventStatus;
  retryCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthEvent extends IEvent<IUserPayload> {}
export interface IAuthEventOutbox extends IEventOutbox<IUserPayload> {}

// export interface IEventQueueConfigItem {
//   eventRetryLimit: number;
//   eventTimeoutMs: number;
//   batchSize: number;
//   cronJobBufferMs: number;
//   lockExpiration: DurationLikeObject;
// }

// export type IEventQueueConfig = {
//   [key in EventQueue]: IEventQueueConfigItem;
// };

// // Events are processed in batches and parallely.
// export const EventQueueConfig: IEventQueueConfig = {
//   [EventQueue.authQueue]: {
//     eventRetryLimit: 5,
//     // Processing timeout per event
//     eventTimeoutMs: 5 * 1000,
//     batchSize: 20,
//     // Buffer time to wait run the next cron job
//     cronJobBufferMs: 30 * 1000,
//     lockExpiration: {
//       minutes: 1,
//     },
//   },
// };
