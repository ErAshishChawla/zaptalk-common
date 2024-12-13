export enum OutboxEventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum OutboxEventQueue {
  authQueue = "authQueue",
}

export interface IOutboxEvent<D = any> {
  id: number;
  queue: OutboxEventQueue;
  topic: KafkaTopic;
  payload: D;
  status: OutboxEventStatus;
  retryCount: number;
  lockExpiration: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum KafkaTopic {
  userCreated = "user.created",
  userVerified = "user.verified",
  userResendVerification = "user.resend-verification",
}

export interface IKafkaEvent<D = any> {
  topic: KafkaTopic;
  payload: D;
}

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
