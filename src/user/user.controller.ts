import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { TestUsers } from '../entity/test_users.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: { username: string; projectId: number }): Promise<TestUsers> {
    return this.userService.create(createUserDto);
  }

  @Get(':userId')
  async findById(@Param('userId') userId: number): Promise<TestUsers> {
    return this.userService.findById(userId);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<TestUsers> {
    return this.userService.findByUsername(username);
  }

  @Put(':userId')
  async update(@Param('userId') userId: number, @Body() updateUserDto: { username?: string; projectId?: number }): Promise<TestUsers> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: number): Promise<void> {
    return this.userService.remove(userId);
  }
}
