import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { BotConfigurationService } from './bot-configuration.service';
import { TestBotConfigurations } from '../entity/bot_configurations.entity';
import { CreateBotConfigurationDto, UpdateBotConfigurationDto } from './bot-configuration.dto';

@Controller('bot-configurations')
export class BotConfigurationController {
  constructor(private readonly botConfigurationService: BotConfigurationService) {}

  @Post()
  async create(@Body() createBotConfigDto: CreateBotConfigurationDto): Promise<TestBotConfigurations> {
    return this.botConfigurationService.create(createBotConfigDto);
  }

  @Get(':configId')
  async findById(@Param('configId', ParseIntPipe) configId: number): Promise<TestBotConfigurations> {
    return this.botConfigurationService.findById(configId);
  }

  @Get()
  async findAll(): Promise<TestBotConfigurations[]> {
    return this.botConfigurationService.findAll();
  }

  @Get('project/:projectId')
  async findByProjectId(@Param('projectId', ParseIntPipe) projectId: number): Promise<TestBotConfigurations[]> {
    return this.botConfigurationService.findByProjectId(projectId);
  }

  @Put(':configId')
  async update(@Param('configId', ParseIntPipe) configId: number, @Body() updateBotConfigDto: UpdateBotConfigurationDto): Promise<TestBotConfigurations> {
    return this.botConfigurationService.update(configId, updateBotConfigDto);
  }

  @Delete(':configId')
  async remove(@Param('configId', ParseIntPipe) configId: number): Promise<void> {
    return this.botConfigurationService.remove(configId);
  }
}
