import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { AssistantService } from './assistant.service'; 
import { CreateUserDto } from '../user/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly authService: AuthService,
    private readonly assistantService: AssistantService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('message')
  async sendMessage(
    @Body() body: { message: string },
    @Req() request: any,
  ): Promise<{ response: string }> {
    try {
      const { message } = body;
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      const userId = this.authService.getUserIdFromToken(token);
      const response = await this.assistantService.sendMessage(userId, message);
      return { response };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{ userId: number }> {
    try {
      const user = await this.assistantService.registerUser(createUserDto);
      return { userId: user.userId };
    } catch (error) {
      throw new HttpException(
        error.message || 'Conflict',
        error.status || HttpStatus.CONFLICT,
      );
    }
  }
}
