import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { Roles, FileUploadStatus, IUserPayload } from "../types";

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Entity("users")
export class User {
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

  static build(attrs: UserCreationAttributes) {
    const user = new User();
    user.email = attrs.email;
    user.password = bcrypt.hashSync(attrs.password, 10);
    user.verificationToken = nanoid();
    user.verificationTokenExpiry = DateTime.now().plus({ hours: 24 }).toISO();
    return user;
  }

  async toJSON(): Promise<IUserPayload> {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isVerified: this.isVerified,
      isDeactivated: this.isDeactivated,
      isRegistrationCompleted: this.isRegistrationCompleted,
      // TODO: Convert this to s3 presigned get url
      avatar: this.avatarKey,
      profileDescription: this.profileDescription,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
