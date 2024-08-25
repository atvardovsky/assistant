import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [OpenAIModule],
  providers: [TelegramService],
})
export class TelegramModule {}
