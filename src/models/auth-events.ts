import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { EventTopic, EventQueue, EventStatus, BaseEvent } from "../events";
import { UserPayload } from "../types";

@Entity()
export class AuthEventEntity extends BaseEvent<UserPayload> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("enum", { enum: EventQueue, default: EventQueue.authQueue })
  queue: EventQueue.authQueue;

  @Column("enum", { enum: EventTopic })
  topic: EventTopic;

  @Column("jsonb")
  payload: UserPayload;

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
}
