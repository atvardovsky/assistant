import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';

/**
 * Module encapsulating OpenAI integration
 * Provides OpenAI service for managing assistant conversations
 * Exports service for use in other modules (e.g., Telegram)
 */
@Module({
  imports: [HttpModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}