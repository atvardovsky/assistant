import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

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

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, projectId } = createUserDto;
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({ username, password: hashedPassword, projectId });
    return newUser;
  }
}
