import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateTestMessagesTable1727564456416 implements MigrationInterface {
    name = 'RecreateTestMessagesTable1727564456416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the existing table
        await queryRunner.query(`DROP TABLE IF EXISTS test_messages`);

        // Create the new table with the desired structure
        await queryRunner.query(`
            CREATE TABLE test_messages (
                message_id SERIAL PRIMARY KEY,
                conversation_id INT NOT NULL,
                thread_id VARCHAR(255) NOT NULL,
                user_id INT NOT NULL,
                sender VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES test_conversations(conversation_id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the new table if rolling back
        await queryRunner.query(`DROP TABLE IF EXISTS test_messages`);
    }
}
