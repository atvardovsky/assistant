// telegram.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { OpenAIService } from '../openai/openai.service';
import axios from 'axios';
import { streamToBuffer } from 'src/utils/streamToBuffer';

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
        return ctx.reply('Please provide a name.');
      }

      try {
        await this.assistantService.registerUser(userId, name);
        ctx.reply('Successfully registered!');
      } catch (error) {
        ctx.reply(`Registration failed: ${error.message}`);
      }
    });

    this.telegramBot.on('text', async (ctx) => {
      const userId = ctx.from.id.toString();
      const message = ctx.message.text;
      const response = await this.assistantService.sendMessageToAssistant(message, userId);
      ctx.reply(response);
    });

    this.telegramBot.on('photo', async (ctx) => {
      const userId = ctx.from.id.toString();
      const fileId = ctx.message.photo[0].file_id;

      try {
        const fileLink = await this.telegramBot.telegram.getFileLink(fileId);
        const response = await axios.get(fileLink.href, { responseType: 'stream' });
        const fileStream = response.data;

        const message = ctx.message.caption || '';

        const textResponse = await this.assistantService.sendFileToAssistant(fileStream, fileId, message, userId);
        ctx.reply(textResponse);
      } catch (error) {
        ctx.reply(`Error: ${error.message}`);
      }
    });

    this.telegramBot.on('document', async (ctx) => {
      const userId = ctx.from.id.toString();
      const file = ctx.message.document;
      const fileId = file.file_id;
      const fileName = file.file_name || `file_${Date.now()}`;
      const fileMimeType = file.mime_type;
      const fileUrl = await this.telegramBot.telegram.getFileLink(fileId);
      
      try {
        const fileResponse = await axios.get(fileUrl.href, { responseType: 'stream' });
        const fileStream = fileResponse.data;
        const response = await this.assistantService.sendFileToAssistant(fileStream, fileName, `File received (${fileMimeType})`, userId);
        ctx.reply(response);
      } catch (error) {
        ctx.reply(`Error processing file: ${error.message}`);
      }
    });

    this.telegramBot.launch();
  }
}
