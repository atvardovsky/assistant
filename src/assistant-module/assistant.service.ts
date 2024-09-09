import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { UserService } from '../user/user.service';

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

    const response = await this.openAIService.sendMessageToAssistant(
      message,
      userId.toString(),
    );
    return response;
  }

  async registerUser(username: string, projectId: number): Promise<any> {
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.create({ username, projectId });
    return newUser;
  }
}
