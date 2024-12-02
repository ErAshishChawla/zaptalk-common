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
}

export abstract class BaseEvent<D = Record<string, any>> {
  abstract id: number;
  abstract topic: EventTopic;
  abstract queue: EventQueue;
  abstract payload: D;
  abstract status: EventStatus;
  abstract lockedAt: Date;
  abstract createdAt: Date;
  abstract updatedAt: Date;
}
