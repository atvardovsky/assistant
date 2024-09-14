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

    let userRedisId = this.configService.get('PROJECT_NAME')+ '_' + userId;

    let threadId = await this.redisClient.get(userRedisId);

    if(!threadId)
    {
        threadId = await this.createThread();
        await this.redisClient.set(userRedisId, threadId);
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
      while( 'completed' != status)
      {
        let run_response = await this.openai.beta.threads.runs.retrieve(
            threadId,
             run.id
           );
           status = run_response.status;

           if (status === 'failed') {
            throw new Error('Assistant run failed');
          }
      }

    const messages = await this.openai.beta.threads.messages.list(
        threadId,
        {query: 'order=created_at:desc'}
      );
      
    const lastMessage = messages.data[0];

    let textReponse = '';
    

    if (lastMessage.content[0]?.type === 'text') {
      textReponse = lastMessage.content[0].text.value;
    }

    return textReponse;
  }

  private async createThread(): Promise<string> {
    const thread = await this.openai.beta.threads.create();
    return thread.id;
  }

  private async waitForResponse(threadId: string, maxRetries = 5, retryInterval = 2000): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const messages = await this.openai.beta.threads.messages.list(threadId);
      const content = messages.data[0].content[0];
      return content.type === 'text' ? content.text.value : 'Non-text response received';
    }
    return 'No content available after retries';
  }
  
  private async waitForRunCompletion(threadId: string, runId: string): Promise<string> {
    let run;
    do {
      run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    } while (run.status !== 'completed');
  
    const messages = await this.openai.beta.threads.messages.list(threadId);
    const content = messages.data[0].content[0];
    return content.type === 'text' ? content.text.value : 'Non-text response received';
  }

  async processFile(fileBuffer: Buffer, fileName: string, userId: string): Promise<string> {

    const file = new File([fileBuffer], fileName, { type: 'application/octet-stream' });
    
    let userRedisId = this.configService.get('PROJECT_NAME')+ '_' + userId;

    let threadId = await this.redisClient.get(userRedisId);

    if(!threadId)
    {
        threadId = await this.createThread();
        await this.redisClient.set(userRedisId, threadId);
    }

    // Upload the file to OpenAI
    const uploadedFile = await this.openai.files.create({
      file: file,
      purpose: 'assistants',
    });
    console.log(uploadedFile);

    // Add the file to the thread
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: [
        { type: 'text', text: `I've uploaded a file named ${fileName}. Please analyze it aaccording your instructions and use my language` },
        { 
          type: 'image_file', 
          image_file: { file_id: uploadedFile.id }
        }
      ],
    });

    // Run the assistant
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });
    
    // Wait for the run to complete and get the response
    const response = await this.waitForRunCompletion(threadId, run.id);

    return response;

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
}