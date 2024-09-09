import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordColumnToUsers1725907107936 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test_users\` ADD \`password\` varchar(255) NOT NULL`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test_users\` DROP COLUMN \`password\``);
    }

}
