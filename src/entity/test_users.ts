import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TestProjects } from "./test_projects"; 
import { TestUserPlatforms } from "./test_user_platforms"; 
import { TestConversations } from "./test_conversations"; 
import { TestUserProfileFields } from "./test_user_profile_fields";

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