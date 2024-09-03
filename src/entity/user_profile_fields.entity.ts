import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestUsers } from "./test_users.entity"; 
import { TestProfileFields } from "./profile_fields.entity"; 

@Entity({ name: "test_user_profile_fields" })
export class TestUserProfileFields {
  @PrimaryGeneratedColumn({ name: "user_profile_field_id" })
  userProfileFieldId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "field_id" })
  fieldId: number;

  @Column({ name: "field_value", type: "text" })
  fieldValue: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => TestUsers, (user) => user.userProfileFields)
  @JoinColumn({ name: "user_id" })
  user: TestUsers;

  @ManyToOne(() => TestProfileFields, (profileField) => profileField.userProfileFields)
  @JoinColumn({ name: "field_id" })
  profileField: TestProfileFields;
}
