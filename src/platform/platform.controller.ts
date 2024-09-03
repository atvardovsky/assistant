import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { TestUserPlatforms } from '../entity/user_platforms.entity';
import { CreatePlatformDto, UpdatePlatformDto } from './platform.dto';

@Controller('platforms')
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

  @Put(':platformId')
  async update(@Param('platformId') platformId: number, @Body() updatePlatformDto: UpdatePlatformDto): Promise<TestUserPlatforms> {
    return this.platformService.update(platformId, updatePlatformDto);
  }

  @Delete(':platformId')
  async remove(@Param('platformId') platformId: number): Promise<void> {
    return this.platformService.remove(platformId);
  }
}
