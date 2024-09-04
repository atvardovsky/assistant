import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private telegramBot: Telegraf;

  constructor(
    private configService: ConfigService,
    private assistantService: OpenAIService,
  ) {}

  async onModuleInit() {
    this.initializeTelegramBot();
  }

  private initializeTelegramBot() {
    const telegramToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.telegramBot = new Telegraf(telegramToken);

    this.telegramBot.start((ctx) => ctx.reply('Welcome! Use /register <your_name> to register.'));

    this.telegramBot.command('register', async (ctx) => {
      const userId = ctx.from.id.toString();
      const name = ctx.message.text.split(' ').slice(1).join(' ');
    
      if (!name) {
        return ctx.reply('Please provide your name. Usage: /register <your_name>');
      }
    
      const user = await this.assistantService.registerUser(userId, name);
      ctx.reply(`User ${user.username} registered successfully!`);
    });

    this.telegramBot.on('text', async (ctx) => {
      const userId = ctx.from.id.toString();
      const message = ctx.message.text;
      const response = await this.assistantService.sendMessageToAssistant(message, userId);
      ctx.reply(response);
    });

    this.telegramBot.launch();
  }
}
