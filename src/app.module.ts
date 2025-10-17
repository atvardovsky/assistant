import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { TelegramModule } from './telegram/telegram.module';

/**
 * Root application module that orchestrates the entire application
 * Imports ConfigModule globally for environment variable access
 * Integrates OpenAI and Telegram modules for bot functionality
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OpenAIModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
