import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { CreateUserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';
import { Readable } from 'stream';
import { UserService } from 'src/user/user.service';
import { streamToBuffer } from 'src/utils/streamToBuffer'; // Ensure correct import path

@Injectable()
export class AssistantService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly userService: UserService,
  ) {}

  async sendMessage(userId: number, message: string): Promise<string> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.openAIService.sendMessageToAssistant(message, userId.toString());
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, projectId } = createUserDto;
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({ username, password: hashedPassword, projectId });
  }

  async processFile(fileBuffer: Buffer, fileName: string, message: string, userId: string): Promise<string> {
    // Process the file with OpenAI
    return this.openAIService.processFile(fileBuffer, fileName, userId);
  }
}
