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
  lockedAt: Date | null;
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

  @Column("timestamp", { nullable: true, default: null })
  lockedAt: Date | null;

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
      lockedAt: this.lockedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
