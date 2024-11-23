export enum OutboxEventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum EventSubject {
  USER_SIGNUP = "USER_SIGNUP",
  USER_REGISTERED = "USER_REGISTERED",
}

export interface OutboxEvent {
  id: number;
  subject: EventSubject;
  status: OutboxEventStatus;
  payload: Record<string, any>;
  lockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
