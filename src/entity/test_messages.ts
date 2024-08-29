import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestConversations } from "./test_conversations";

@Entity({ name: "test_messages" })
export class TestMessages {
  @PrimaryGeneratedColumn({ name: "message_id" })
  messageId: number;

  @Column({ name: "conversation_id" })
  conversationId: number;

  @Column({ length: 50 })
  sender: string;

  @Column("text")
  content: string;

  @Column({ name: "message_type", length: 50 })
  messageType: string;

  @Column({ length: 50 })
  status: string;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @ManyToOne(() => TestConversations, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversation_id" })
  conversation: TestConversations;
}
