import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TestProjects } from "./projects.entity"; 
import { TestUserProfileFields } from "./user_profile_fields.entity"; 

@Entity({ name: "test_profile_fields" })
export class TestProfileFields {
  @PrimaryGeneratedColumn({ name: "field_id" })
  fieldId: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "field_name", length: 255 })
  fieldName: string;

  @Column({ name: "field_type", length: 50 })
  fieldType: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => TestProjects, (project) => project.profileFields)
  @JoinColumn({ name: "project_id" })
  project: TestProjects;

  @OneToMany(() => TestUserProfileFields, (userProfileField) => userProfileField.profileField)
  userProfileFields: TestUserProfileFields[];
}
