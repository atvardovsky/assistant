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
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const fileId = photo.file_id;
      const fileUrl = await ctx.telegram.getFileLink(fileId);

      // Extract the file extension from the URL
      const fileExtension = fileUrl.pathname.split('.').pop();
      const fileName = `image_${Date.now()}.${fileExtension}`;
          
      // Download the file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
          
      // Process the file using OpenAI API
      const result = await this.assistantService.processFile(fileBuffer, fileName, userId);
            
      ctx.reply(result);
    });

    this.telegramBot.on('document', async (ctx) => {
      console.log('FILE RECEIVED');
      const userId = ctx.from.id.toString();
      const fileId = ctx.message.document.file_id;
      const fileName = ctx.message.document.file_name;
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      
      // Download the file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
    
      // Process the file using OpenAI API
      const result = await this.assistantService.processFile(fileBuffer, fileName, userId);
      
      ctx.reply(result);
    });

    this.telegramBot.launch();
  }
}
