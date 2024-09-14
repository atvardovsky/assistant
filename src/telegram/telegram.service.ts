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


    this.telegramBot.on('text', async (ctx) => {
      const userId = ctx.from.id.toString();
      const message = ctx.message.text;
      const response = await this.assistantService.sendMessageToAssistant(message, userId);
      ctx.reply(response);
    });

    this.telegramBot.on('photo', async (ctx) => {
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
      const result = await this.assistantService.processFile(fileBuffer, fileName, ctx.from.id.toString());
      
      ctx.reply(result);
    });

    this.telegramBot.on('document', async (ctx) => {
      console.log('FILE RECEIVED');
      const fileId = ctx.message.document.file_id;
      const fileName = ctx.message.document.file_name;
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      
      // Download the file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
    
      // Process the file using OpenAI API
      const result = await this.assistantService.processFile(fileBuffer, fileName, ctx.from.id.toString());
      
      ctx.reply(result);
    });

    this.telegramBot.launch();
  }
}
