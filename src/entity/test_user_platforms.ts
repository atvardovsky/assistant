import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestUsers } from "./test_users";

@Entity({ name: "test_user_platforms" })
export class TestUserPlatforms {
  @PrimaryGeneratedColumn({ name: "user_platform_id" })
  userPlatformId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ length: 50 })
  platform: string;

  @Column({ name: "platform_user_id", length: 255 })
  platformUserId: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => TestUsers, (user) => user.userPlatforms)
  @JoinColumn({ name: "user_id" })
  user: TestUsers;
}
