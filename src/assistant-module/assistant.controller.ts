import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AssistantService } from './assistant.service'; 
import { CreateUserDto } from '../user/user.dto';
  
@Controller('assistant')
export class AssistantController {
    constructor(private readonly assistantService: AssistantService) {}
  
    @Post('message')
    async sendMessage(
      @Body() body: { userId: number; message: string },
    ): Promise<{ response: string }> {
      try {
        const { userId, message } = body;
        const response = await this.assistantService.sendMessage(
          userId,
          message,
        );
        return { response };
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal Server Error',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Post('register')
    async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<{ userId: number }> {
      try {
        const user = await this.assistantService.registerUser(
          createUserDto.username,
          createUserDto.projectId,
        );
        return { userId: user.userId };
      } catch (error) {
        throw new HttpException(
          error.message || 'Conflict',
          error.status || HttpStatus.CONFLICT,
        );
      }
    }
  }
  