import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TestProjects } from "./projects.entity"; 
import { TestUserPlatforms } from "./user_platforms.entity"; 
import { TestConversations } from "./conversations.entity"; 
import { TestUserProfileFields } from "./user_profile_fields.entity";

@Entity({ name: "test_users" })
export class TestUsers {
  @PrimaryGeneratedColumn({ name: "user_id" })
  userId: number;

  @Column({ length: 255 })
  username: string;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => TestProjects, (project) => project.users)
  @JoinColumn({ name: "project_id" })
  project: TestProjects;

  @OneToMany(() => TestUserPlatforms, (userPlatform) => userPlatform.user)
  userPlatforms: TestUserPlatforms[];

  @OneToMany(() => TestConversations, (conversation) => conversation.user)
  conversations: TestConversations[];

  // Add this property
  @OneToMany(() => TestUserProfileFields, (userProfileField) => userProfileField.user)
  userProfileFields: TestUserProfileFields[];
}