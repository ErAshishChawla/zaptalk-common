import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import {
  EventTopic,
  EventQueue,
  EventStatus,
  IAuthServiceEvent,
} from "../events";
import { IUserPayload } from "../types";

export const EVENT_RETRY_LIMIT = 5;

interface AuthServiceEventCreationAttributes {
  payload: IUserPayload;
  topic: EventTopic;
}

interface IAuthServiceEventJSON {
  id: number;
  queue: EventQueue.authQueue;
  topic: EventTopic;
  payload: IUserPayload;
  status: EventStatus;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity("auth_service_events")
export class AuthServiceEvent implements IAuthServiceEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("enum", { enum: EventQueue, default: EventQueue.authQueue })
  queue: EventQueue.authQueue;

  @Column("enum", { enum: EventTopic })
  topic: EventTopic;

  @Column("jsonb")
  payload: IUserPayload;

  @Column("enum", {
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus;

  @Column("int", { default: 0 })
  retryCount: number;

  @Column("timestamp", { nullable: true, default: null })
  lockExpiration: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static build(attrs: AuthServiceEventCreationAttributes) {
    const authEvent = new AuthServiceEvent();
    authEvent.payload = attrs.payload;
    authEvent.topic = attrs.topic;
    return authEvent;
  }

  toJSON(): IAuthServiceEventJSON {
    return {
      id: this.id,
      queue: this.queue,
      topic: this.topic,
      payload: this.payload,
      status: this.status,
      retryCount: this.retryCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
