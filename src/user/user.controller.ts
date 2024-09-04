import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { TestUsers } from '../entity/users.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { OpenAIService } from 'src/openai/openai.service';
import { PlatformService } from 'src/platform/platform.service';
import { CreatePlatformDto } from 'src/platform/platform.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly openAIService: OpenAIService,
    private readonly platformService: PlatformService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Body() createPlatformDto: CreatePlatformDto
  ): Promise<TestUsers> {
    try {
      const user = await this.userService.create(createUserDto);
  
      createPlatformDto.userId = user.userId;
  
      await this.platformService.create(createPlatformDto);
  
      return user;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: error.message },
        HttpStatus.CONFLICT
      );
    }
  }
  
  @Get(':userId')
  async findById(@Param('userId') userId: number): Promise<TestUsers> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<TestUsers> {
    try {
      const user = await this.userService.findByUsername(username);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':userId')
  async update(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<TestUsers> {
    try {
      const updatedUser = await this.userService.update(userId, updateUserDto);
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: number): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userService.remove(userId);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
