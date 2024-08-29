import { DataSource } from "typeorm";
import { TestBotConfigurations } from "./src/entity/test_bot_configurations";
import { TestConversations } from "./src/entity/test_conversations";
import { TestLogs } from "./src/entity/test_logs";
import { TestMessages } from "./src/entity/test_messages";
import { TestProfileFields } from "./src/entity/test_profile_fields";
import { TestProjects } from "./src/entity/test_projects";
import { TestUserPlatforms } from "./src/entity/test_user_platforms";
import { TestUserProfileFields } from "./src/entity/test_user_profile_fields";
import { TestUsers } from "./src/entity/test_users";


export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'iDoctor',
    password: 'iDoctor',
    database: 'iDoctor',
    entities: [
        TestMessages,
        TestConversations,
        TestUsers,
        TestProjects,
        TestBotConfigurations,
        TestUserPlatforms,
        TestLogs,
        TestProfileFields,
        TestUserProfileFields
    ],
    migrations: ['src/migration/**/*.ts'],
    synchronize: false,
    logging: true,
})