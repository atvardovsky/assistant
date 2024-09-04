import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUsers } from '../entity/users.entity';
import { TestUserPlatforms } from 'src/entity/user_platforms.entity';
import { PlatformService } from 'src/platform/platform.service'; 

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
    private readonly userPlatformsRepository: Repository<TestUserPlatforms>, // Добавляем это свойство
  ) {
    this.initializeOpenAIClient();
    this.initializeRedisClient();
  }
  
  private initializeRedisClient() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  private initializeOpenAIClient() {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.assistantId = this.configService.get('ASSISTANT_ID');
  }

  public async sendMessageToAssistant(message: string, userId: string): Promise<string> {

    let threadId = await this.redisClient.get(userId);

    if(!threadId)
    {
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
      while( 'completed' != status)
      {
        let run_response = await this.openai.beta.threads.runs.retrieve(
            threadId,
             run.id
           );
           status = run_response.status;
      }
    const messages = await this.openai.beta.threads.messages.list(
        threadId,
        {query: 'order=created_at:desc'}
      );
    const lastMessage = messages.data[0];

    let textReponse = '';

    

    if (lastMessage.content[0].type == 'text') {
        textReponse = lastMessage.content[0].text.value;
    }

    return textReponse;
  }

  private async createThread(): Promise<string> {
    const response = await this.openai.beta.threads.create();
    return response.id;
  }

  private async waitForResponse(threadId: string, maxRetries = 5, retryInterval = 2000): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const messages = await this.openai.beta.threads.messages.list(threadId);
      const assistantMessages = messages.data?.filter(message => message.role === 'assistant') || [];
      if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[assistantMessages.length - 1];
        return typeof latestMessage.content === 'string' ? latestMessage.content : JSON.stringify(latestMessage.content);
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
    return 'No content available after retries';
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
}