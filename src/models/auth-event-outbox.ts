import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { nanoid } from "nanoid";

import {
  EventStatus,
  IAuthEvent,
  KafkaTopic,
  RMQQueue,
  IAuthEventOutbox,
} from "../events";
import { IUserPayload } from "../types";

interface AuthEventOutboxCreationAttributes {
  payload: IUserPayload;
  topic: KafkaTopic;
}

@Entity("auth_event_outbox")
export class AuthEventOutbox implements IAuthEventOutbox {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("enum", {
    enum: RMQQueue,
    default: RMQQueue.authEventOutbox,
  })
  queue: RMQQueue.authEventOutbox;

  @Column("enum", { enum: KafkaTopic })
  topic: KafkaTopic;

  @Column("jsonb")
  payload: IUserPayload;

  @Column("text", { unique: true })
  uniqueKey: string;

  @Column("enum", {
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus;

  @Column("int", { default: 0 })
  retryCount: number;

  @Column("timestamp", { nullable: true, default: null })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static build(attrs: AuthEventOutboxCreationAttributes) {
    const authEvent = new AuthEventOutbox();
    authEvent.payload = attrs.payload;
    authEvent.topic = attrs.topic;
    authEvent.uniqueKey = nanoid();
    return authEvent;
  }

  toEvent(): IAuthEvent {
    return {
      queue: this.queue,
      topic: this.topic,
      payload: this.payload,
      uniqueKey: this.uniqueKey,
    };
  }

  toJSON(): IAuthEventOutbox {
    return {
      id: this.id,
      queue: this.queue,
      topic: this.topic,
      payload: this.payload,
      uniqueKey: this.uniqueKey,
      status: this.status,
      retryCount: this.retryCount,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
