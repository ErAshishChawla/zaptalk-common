import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

import { Roles } from "../types";
import { FileUploadStatus } from "../types";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column("text", { nullable: true, default: null })
  firstName: string | null;

  @Column("text", { nullable: true, default: null })
  lastName: string | null;

  @Column("enum", { enum: Roles, default: Roles.USER })
  role: Roles;

  @Column("text", { nullable: true, default: null })
  verificationToken?: string;

  @Column("text", { nullable: true, default: null })
  verificationTokenExpiry?: string;

  @Column("text", { nullable: true, default: null })
  resetPasswordToken?: string;

  @Column("text", { nullable: true, default: null })
  resetPasswordTokenExpiry?: string;

  @Column("boolean", { default: false })
  isVerified: boolean;

  @Column("boolean", { default: false })
  isDeactivated: boolean;

  @Column("boolean", { default: false })
  isRegistrationCompleted: boolean;

  @Column("text", { nullable: true, default: null })
  avatarKey: string | null;

  @Column("enum", { enum: FileUploadStatus, nullable: true, default: null })
  avatarUploadStatus: FileUploadStatus | null;

  @Column("text", { default: "Hey there I''m using Zaptalk!" })
  profileDescription: string;

  @Column("int", { default: 0 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
