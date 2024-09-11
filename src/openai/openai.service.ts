import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUsers } from '../entity/users.entity';
import { TestUserPlatforms } from 'src/entity/user_platforms.entity';
import { PlatformService } from 'src/platform/platform.service';
import { TestBotConfigurations } from 'src/entity/bot_configurations.entity';
import { streamToBuffer } from 'src/utils/streamToBuffer';
import { JwtService } from '@nestjs/jwt';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private assistantId: string;
  private redisClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly platformService: PlatformService,
    @InjectRepository(TestUsers)
    private readonly usersRepository: Repository<TestUsers>,
    @InjectRepository(TestUserPlatforms)
    private readonly userPlatformsRepository: Repository<TestUserPlatforms>,
    @InjectRepository(TestBotConfigurations)
    private readonly botConfigRepository: Repository<TestBotConfigurations>,
    private readonly jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
    this.initializeOpenAIClient();
    this.initializeRedisClient();
  }

  private initializeRedisClient() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  private async initializeOpenAIClient() {
    const botConfig = await this.botConfigRepository.findOne({
      where: { projectId: 1 },
    });

    if (!botConfig) {
      throw new Error('Bot configuration not found in the database.');
    }

    this.openai = new OpenAI({
      apiKey: botConfig.apiKey,
    });
    this.assistantId = botConfig.assistantId;
  }

  public async sendMessageToAssistant(message: string, userId: string): Promise<string> {
    let threadId = await this.redisClient.get(userId);

    if (!threadId) {
      threadId = await this.createThread();
      await this.redisClient.set(userId, threadId);
    }

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    let run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
      additional_instructions: "Use telegram emojis whenever possible, and use telegram markdown formatting.",
    });

    let status = 'start';
    while (status !== 'completed') {
      let run_response = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      status = run_response.status;
      if (status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }

    const messages = await this.openai.beta.threads.messages.list(threadId, {
      query: 'order=created_at:desc',
    });

    const lastMessage = messages.data[0];
    let textResponse = '';

    if (lastMessage.content[0]?.type === 'text') {
      textResponse = lastMessage.content[0].text.value;
    }

    return textResponse;
  }

  public async sendFileToAssistant(fileStream: Readable, fileName: string, message: string, userId: string): Promise<string> {
    let threadId = await this.redisClient.get(userId);

    if (!threadId) {
      threadId = await this.createThread();
      await this.redisClient.set(userId, threadId);
    }

    // Send message first
    if (message.trim()) {
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });
    }

    try {
      const fileBuffer = await streamToBuffer(fileStream);

      // Check file size and handle errors
      const maxSize = 25 * 1024 * 1024; // 25 MB size limit
      if (fileBuffer.length > maxSize) {
        return 'File size exceeds the limit. Please upload a smaller file.';
      }

      // Save the file temporarily to handle the upload
      const tempFilePath = path.join(__dirname, 'tempFile');
      fs.writeFileSync(tempFilePath, fileBuffer);

      const fileStreamForUpload = fs.createReadStream(tempFilePath);

      // Upload the file to OpenAI
      const fileResponse = await this.openai.files.create({
        file: fileStreamForUpload,
        purpose: 'vision', // Use 'vision' for image files
      });

      const fileId = fileResponse.id;

      // Add context message for the file
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: `The uploaded file ${fileName} has been processed.`,
      });

      // Send a request to analyze the file
      const runResponse = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
        additional_instructions: 'Analyze the attached file and respond accordingly.',
      });

      let status = 'start';
      while (status !== 'completed') {
        let run_response = await this.openai.beta.threads.runs.retrieve(threadId, runResponse.id);
        status = run_response.status;
        if (status === 'failed') {
          throw new Error('Assistant run failed');
        }
      }

      const messages = await this.openai.beta.threads.messages.list(threadId, {
        query: 'order=created_at:desc',
      });

      const lastMessage = messages.data[0];
      let textResponse = '';

      if (lastMessage.content[0]?.type === 'text') {
        textResponse = lastMessage.content[0].text.value;
      }

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      return textResponse;

    } catch (error) {
      // Log detailed error for debugging
      console.error('Error processing file:', error);
      return 'An error occurred while processing the file.';
    }
  }

  private async createThread(): Promise<string> {
    const response = await this.openai.beta.threads.create();
    return response.id;
  }

  public async registerUser(platformUserId: string, username: string): Promise<TestUsers> {
    const existingUser = await this.platformService.findByPlatformId(platformUserId);
    if (existingUser) {
      throw new Error('User already registered.');
    }

    const newUser = new TestUsers();
    newUser.username = username;
    newUser.projectId = 1;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    await this.usersRepository.save(newUser);

    const newUserPlatform = {
      userId: newUser.userId,
      platform: 'Telegram',
      platformUserId: platformUserId,
    };

    await this.platformService.create(newUserPlatform);

    return newUser;
  }

  public getUserIdFromToken(token: string): number {
    const decoded = this.jwtService.verify(token);
    return decoded.sub;
  }

  private async waitForResponse(threadId: string, maxRetries = 5, retryInterval = 2000): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const messages = await this.openai.beta.threads.messages.list(threadId);
      const assistantMessages = messages.data?.filter(message => message.role === 'assistant') || [];
      if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[assistantMessages.length - 1];
        return typeof latestMessage.content === 'string'
          ? latestMessage.content
          : JSON.stringify(latestMessage.content);
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }

    return 'No content available after retries';
  }
}