import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestConversations } from "./conversations.entity";

@Entity({ name: "test_messages" })
export class TestMessages {
  @PrimaryGeneratedColumn({ name: "message_id" })
  messageId: number;

  @Column({ name: "conversation_id" })
  conversationId: number;

  @Column({ name: "thread_id" }) // Поле для threadId
  threadId: string; // Измените тип на string, если threadId является строкой

  @Column({ name: "user_id" }) // Поле для userId
  userId: number;

  @Column({ length: 50 })
  sender: string;

  @Column({ length: 50 })
  status: string;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @ManyToOne(() => TestConversations, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversation_id" })
  conversation: TestConversations;
}
