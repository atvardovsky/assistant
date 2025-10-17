import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { OpenAIModule } from '../openai/openai.module';

/**
 * Module handling Telegram bot integration
 * Depends on OpenAIModule to process user messages
 */
@Module({
  imports: [OpenAIModule],
  providers: [TelegramService],
})
export class TelegramModule {}
