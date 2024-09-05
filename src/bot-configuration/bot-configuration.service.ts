import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestBotConfigurations } from '../entity/bot_configurations.entity';
import { CreateBotConfigurationDto, UpdateBotConfigurationDto } from './bot-configuration.dto';

@Injectable()
export class BotConfigurationService {
  constructor(
    @InjectRepository(TestBotConfigurations)
    private readonly botConfigRepository: Repository<TestBotConfigurations>,
  ) {}

  async create(createBotConfigDto: CreateBotConfigurationDto): Promise<TestBotConfigurations> {
    const botConfig = this.botConfigRepository.create(createBotConfigDto);
    botConfig.createdAt = new Date();
    botConfig.updatedAt = new Date();
    return this.botConfigRepository.save(botConfig);
  }

  async findById(configId: number): Promise<TestBotConfigurations> {
    const config = await this.botConfigRepository.findOne({ where: { configId } });
    if (!config) {
      throw new NotFoundException(`Configuration with ID ${configId} not found`);
    }
    return config;
  }

  async update(configId: number, updateBotConfigDto: UpdateBotConfigurationDto): Promise<TestBotConfigurations> {
    const config = await this.findById(configId);
    Object.assign(config, updateBotConfigDto, { updatedAt: new Date() });
    return this.botConfigRepository.save(config);
  }

  async remove(configId: number): Promise<void> {
    const result = await this.botConfigRepository.delete(configId);
    if (result.affected === 0) {
      throw new NotFoundException(`Configuration with ID ${configId} not found`);
    }
  }

  async findAll(): Promise<TestBotConfigurations[]> {
    return this.botConfigRepository.find();
  }

  async findByProjectId(projectId: number): Promise<TestBotConfigurations[]> {
    const configs = await this.botConfigRepository.find({ where: { projectId } });
    if (configs.length === 0) {
      throw new NotFoundException(`No configurations found for project ID ${projectId}`);
    }
    return configs;
  }
}