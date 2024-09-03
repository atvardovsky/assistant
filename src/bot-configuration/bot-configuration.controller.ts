import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { BotConfigurationService } from './bot-configuration.service';
import { TestBotConfigurations } from '../entity/bot_configurations.entity';

@Controller('bot-configurations')
export class BotConfigurationController {
  constructor(private readonly botConfigurationService: BotConfigurationService) {}

  @Post()
  async create(@Body() createBotConfigDto: { projectId: number; apiKey: string; assistantId: string; settings: string }): Promise<TestBotConfigurations> {
    return this.botConfigurationService.create(createBotConfigDto);
  }

  @Get(':configId')
  async findById(@Param('configId') configId: number): Promise<TestBotConfigurations> {
    return this.botConfigurationService.findById(configId);
  }

  @Put(':configId')
  async update(@Param('configId') configId: number, @Body() updateBotConfigDto: { apiKey?: string; assistantId?: string; settings?: string }): Promise<TestBotConfigurations> {
    return this.botConfigurationService.update(configId, updateBotConfigDto);
  }

  @Delete(':configId')
  async remove(@Param('configId') configId: number): Promise<void> {
    return this.botConfigurationService.remove(configId);
  }
}
