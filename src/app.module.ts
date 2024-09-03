import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { TelegramModule } from './telegram/telegram.module';
import { AppConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { BotConfigurationModule } from './bot-configuration/bot-configuration.module';
import { PlatformModule } from './platform/project.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (ConfigService: AppConfigService) => ({
        type: 'mysql',
        host: ConfigService.databaseHost,
        port: ConfigService.databasePort,
        username: ConfigService.databaseUser,
        password: ConfigService.databasePassword,
        database: ConfigService.databaseName,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [AppConfigService]
    }),
    OpenAIModule,
    TelegramModule,
    UserModule,
    ProjectModule,
    PlatformModule,
    BotConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
