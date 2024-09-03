import { DataSource } from "typeorm";
import { TestBotConfigurations } from "./src/entity/bot_configurations.entity";
import { TestConversations } from "./src/entity/conversations.entity";
import { TestLogs } from "./src/entity/logs.entity";
import { TestMessages } from "./src/entity/messages.entity";
import { TestProfileFields } from "./src/entity/profile_fields.entity";
import { TestProjects } from "./src/entity/projects.entity";
import { TestUserPlatforms } from "./src/entity/user_platforms.entity";
import { TestUserProfileFields } from "./src/entity/user_profile_fields.entity";
import { TestUsers } from "./src/entity/users.entity";

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
    migrations: ['src/migration/**/*.ts'], // Ensure this matches where migrations are generated
    synchronize: false,
    logging: true,
});