import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private assistantId: string;
  private redisClient;


  constructor(private readonly configService: ConfigService) {
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
}