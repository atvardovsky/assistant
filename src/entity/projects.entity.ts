import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TestUsers } from "./users.entity"; 
import { TestConversations } from "./conversations.entity"; 
import { TestBotConfigurations } from "./bot_configurations.entity"; 
import { TestProfileFields } from "./profile_fields.entity"; 

@Entity({ name: "test_projects" })
export class TestProjects {
  @PrimaryGeneratedColumn({ name: "project_id" })
  projectId: number;

  @Column({ name: "project_name", length: 255 })
  projectName: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => TestUsers, (user) => user.project)
  users: TestUsers[];

  @OneToMany(() => TestConversations, (conversation) => conversation.project)
  conversations: TestConversations[];

  @OneToMany(() => TestBotConfigurations, (botConfig) => botConfig.project)
  botConfigurations: TestBotConfigurations[];

  @OneToMany(() => TestProfileFields, (profileField) => profileField.project)
  profileFields: TestProfileFields[];
}
