import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TestUsers } from "./users.entity"; 
import { TestProjects } from "./projects.entity";
import { TestMessages } from "./messages.entity";

@Entity({ name: "test_conversations" })
export class TestConversations {
  @PrimaryGeneratedColumn({ name: "conversation_id" })
  conversationId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ type: "timestamp" })
  startedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  endedAt: Date;

  @Column({ length: 50 })
  status: string;

  @Column("longtext")
  context: string;

  @ManyToOne(() => TestUsers, (user) => user.conversations)
  @JoinColumn({ name: "user_id" })
  user: TestUsers;

  @ManyToOne(() => TestProjects, (project) => project.conversations)
  @JoinColumn({ name: "project_id" })
  project: TestProjects;

  @OneToMany(() => TestMessages, (message) => message.conversation)
  messages: TestMessages[];
}
