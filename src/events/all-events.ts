/**
 * Enum representing the status of an event.
 */
export enum EventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

/**
 * Enum representing the topic of an event.
 */
export enum EventTopic {
  userCreated = "user:created",
  userVerified = "user:verified",
  userResendVerification = "user:resend-verification",
}

/**
 * Enum representing the queue of an event.
 */
export enum EventQueue {
  authQueue = "authQueue",
}

/**
 * Abstract class representing the base structure of an event.
 *
 * @template D - The type of the payload data.
 */
export abstract class BaseEvent<D extends Record<string, any>> {
  /**
   * The unique identifier of the event.
   */
  abstract id: number;

  /**
   * The topic of the event.
   */
  abstract topic: EventTopic;

  /**
   * The queue to which the event belongs.
   */
  abstract queue: EventQueue;

  /**
   * The payload data of the event.
   */
  abstract payload: D;

  /**
   * The status of the event.
   */
  abstract status: EventStatus;

  /**
   * The date and time when the event was locked.
   */
  abstract lockedAt: Date | null;

  /**
   * The date and time when the event was created.
   */
  abstract createdAt: Date;

  /**
   * The date and time when the event was last updated.
   */
  abstract updatedAt: Date;
}
