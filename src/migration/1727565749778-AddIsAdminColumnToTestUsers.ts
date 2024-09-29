import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAdminColumnToTestUsers1727565749778 implements MigrationInterface {
    name = 'AddIsAdminColumnToTestUsers1727565749778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adding the isAdmin column to the existing test_users table
        await queryRunner.query(`ALTER TABLE \`test_users\` ADD \`isAdmin\` boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Dropping the isAdmin column if the migration is reverted
        await queryRunner.query(`ALTER TABLE \`test_users\` DROP COLUMN \`isAdmin\``);
    }
}
