import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725315046765 implements MigrationInterface {
    name = 'Migration1725315046765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`test_user_platforms\` (\`user_platform_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`platform\` varchar(50) NOT NULL, \`platform_user_id\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`user_platform_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_messages\` (\`message_id\` int NOT NULL AUTO_INCREMENT, \`conversation_id\` int NOT NULL, \`sender\` varchar(50) NOT NULL, \`content\` text NOT NULL, \`message_type\` varchar(50) NOT NULL, \`status\` varchar(50) NOT NULL, \`timestamp\` timestamp NOT NULL, PRIMARY KEY (\`message_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_conversations\` (\`conversation_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`project_id\` int NOT NULL, \`startedAt\` timestamp NOT NULL, \`endedAt\` timestamp NULL, \`status\` varchar(50) NOT NULL, \`context\` longtext NOT NULL, PRIMARY KEY (\`conversation_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_profile_fields\` (\`field_id\` int NOT NULL AUTO_INCREMENT, \`project_id\` int NOT NULL, \`field_name\` varchar(255) NOT NULL, \`field_type\` varchar(50) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`field_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_user_profile_fields\` (\`user_profile_field_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`field_id\` int NOT NULL, \`field_value\` text NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`user_profile_field_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`project_id\` int NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_projects\` (\`project_id\` int NOT NULL AUTO_INCREMENT, \`project_name\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`project_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_bot_configurations\` (\`config_id\` int NOT NULL AUTO_INCREMENT, \`project_id\` int NOT NULL, \`api_key\` varchar(255) NOT NULL, \`assistant_id\` varchar(255) NOT NULL, \`settings\` longtext NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`config_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_logs\` (\`log_id\` int NOT NULL AUTO_INCREMENT, \`entity_type\` varchar(50) NOT NULL, \`entity_id\` int NOT NULL, \`action\` varchar(50) NOT NULL, \`details\` longtext NOT NULL, \`createdAt\` timestamp NOT NULL, PRIMARY KEY (\`log_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`test_user_platforms\` ADD CONSTRAINT \`FK_9fc973b86f1e060c4fee38d84f8\` FOREIGN KEY (\`user_id\`) REFERENCES \`test_users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_messages\` ADD CONSTRAINT \`FK_f313b4d3f40510734eb754a2bdc\` FOREIGN KEY (\`conversation_id\`) REFERENCES \`test_conversations\`(\`conversation_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_conversations\` ADD CONSTRAINT \`FK_3e195b903e036f7eff9e0c4f443\` FOREIGN KEY (\`user_id\`) REFERENCES \`test_users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_conversations\` ADD CONSTRAINT \`FK_484db2dea6936c01f699ed5aa83\` FOREIGN KEY (\`project_id\`) REFERENCES \`test_projects\`(\`project_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_profile_fields\` ADD CONSTRAINT \`FK_c0032c440eb08e22e3a2a379e2f\` FOREIGN KEY (\`project_id\`) REFERENCES \`test_projects\`(\`project_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_user_profile_fields\` ADD CONSTRAINT \`FK_a5f278303c8ad229da171863be6\` FOREIGN KEY (\`user_id\`) REFERENCES \`test_users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_user_profile_fields\` ADD CONSTRAINT \`FK_0822e6b2883f6b8ac38a9a34e99\` FOREIGN KEY (\`field_id\`) REFERENCES \`test_profile_fields\`(\`field_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_users\` ADD CONSTRAINT \`FK_74ec091a89648b6495beddd2e30\` FOREIGN KEY (\`project_id\`) REFERENCES \`test_projects\`(\`project_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_bot_configurations\` ADD CONSTRAINT \`FK_8e088bf835103f0875d5865819f\` FOREIGN KEY (\`project_id\`) REFERENCES \`test_projects\`(\`project_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test_bot_configurations\` DROP FOREIGN KEY \`FK_8e088bf835103f0875d5865819f\``);
        await queryRunner.query(`ALTER TABLE \`test_users\` DROP FOREIGN KEY \`FK_74ec091a89648b6495beddd2e30\``);
        await queryRunner.query(`ALTER TABLE \`test_user_profile_fields\` DROP FOREIGN KEY \`FK_0822e6b2883f6b8ac38a9a34e99\``);
        await queryRunner.query(`ALTER TABLE \`test_user_profile_fields\` DROP FOREIGN KEY \`FK_a5f278303c8ad229da171863be6\``);
        await queryRunner.query(`ALTER TABLE \`test_profile_fields\` DROP FOREIGN KEY \`FK_c0032c440eb08e22e3a2a379e2f\``);
        await queryRunner.query(`ALTER TABLE \`test_conversations\` DROP FOREIGN KEY \`FK_484db2dea6936c01f699ed5aa83\``);
        await queryRunner.query(`ALTER TABLE \`test_conversations\` DROP FOREIGN KEY \`FK_3e195b903e036f7eff9e0c4f443\``);
        await queryRunner.query(`ALTER TABLE \`test_messages\` DROP FOREIGN KEY \`FK_f313b4d3f40510734eb754a2bdc\``);
        await queryRunner.query(`ALTER TABLE \`test_user_platforms\` DROP FOREIGN KEY \`FK_9fc973b86f1e060c4fee38d84f8\``);
        await queryRunner.query(`DROP TABLE \`test_logs\``);
        await queryRunner.query(`DROP TABLE \`test_bot_configurations\``);
        await queryRunner.query(`DROP TABLE \`test_projects\``);
        await queryRunner.query(`DROP TABLE \`test_users\``);
        await queryRunner.query(`DROP TABLE \`test_user_profile_fields\``);
        await queryRunner.query(`DROP TABLE \`test_profile_fields\``);
        await queryRunner.query(`DROP TABLE \`test_conversations\``);
        await queryRunner.query(`DROP TABLE \`test_messages\``);
        await queryRunner.query(`DROP TABLE \`test_user_platforms\``);
    }

}
