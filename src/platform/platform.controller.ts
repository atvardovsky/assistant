import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { TestUserPlatforms } from '../entity/user_platforms.entity';
import { CreatePlatformDto, UpdatePlatformDto } from './platform.dto';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('platforms')
@UseGuards(AdminGuard)
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  async create(@Body() createPlatformDto: CreatePlatformDto): Promise<TestUserPlatforms> {
    return this.platformService.create(createPlatformDto);
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: number): Promise<TestUserPlatforms[]> {
    return this.platformService.findByUserId(userId);
  }

  @Get('platform/:userPlatformId')
  async findByUserPlatformId(@Param('userPlatformId') userPlatformId: number): Promise<TestUserPlatforms | null> {
    return this.platformService.findByUserPlatformId(userPlatformId);
  }

  @Put(':platformId')
  async update(@Param('platformId') platformId: number, @Body() updatePlatformDto: UpdatePlatformDto): Promise<TestUserPlatforms> {
    return this.platformService.update(platformId, updatePlatformDto);
  }

  @Delete(':platformId')
  async remove(@Param('platformId') platformId: number): Promise<void> {
    return this.platformService.remove(platformId);
  }
}
