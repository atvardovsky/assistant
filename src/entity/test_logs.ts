import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "test_logs" })
export class TestLogs {
  @PrimaryGeneratedColumn({ name: "log_id" })
  logId: number;

  @Column({ name: "entity_type", length: 50 })
  entityType: string;

  @Column({ name: "entity_id" })
  entityId: number;

  @Column({ length: 50 })
  action: string;

  @Column("longtext")
  details: string;

  @Column({ type: "timestamp" })
  createdAt: Date;
}
