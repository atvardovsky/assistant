import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestProjects } from "./projects.entity";

@Entity({ name: "test_bot_configurations" })
export class TestBotConfigurations {
  @PrimaryGeneratedColumn({ name: "config_id" })
  configId: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "api_key", length: 255 })
  apiKey: string;

  @Column({ name: "assistant_id", length: 255 })
  assistantId: string;

  @Column("longtext")
  settings: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => TestProjects, (project) => project.botConfigurations)
  @JoinColumn({ name: "project_id" })
  project: TestProjects;
}
