import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { File } from 'node:buffer';
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
    // Create a File object from the Buffer
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
  }}