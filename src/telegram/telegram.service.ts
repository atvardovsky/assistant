import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { OpenAIService } from '../openai/openai.service';

/**
 * Service managing Telegram bot interactions
 * Initializes bot on module startup and routes messages to OpenAI assistant
 */
@Injectable()
export class TelegramService implements OnModuleInit {
  private telegramBot: Telegraf;

  constructor(
    private configService: ConfigService,
    private assistantService: OpenAIService,
  ) {}

  /**
   * Lifecycle hook called when module initializes
   * Starts the Telegram bot
   */
  async onModuleInit() {
    this.initializeTelegramBot();
  }

  /**
   * Initializes Telegram bot with token from environment
   * Sets up text message handler to forward to OpenAI assistant
   */
  private initializeTelegramBot() {
    const telegramToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.telegramBot = new Telegraf(telegramToken);

    this.telegramBot.on('text', async (ctx) => {
      const userId = ctx.from.id.toString();
      const message = ctx.message.text;
      const response = await this.assistantService.sendMessageToAssistant(message, userId);
      ctx.reply(response);
    });

    this.telegramBot.launch();
  }
}