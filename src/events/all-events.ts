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
  locked_at: string | null;
  created_at: string;
  updated_at: string;
}
