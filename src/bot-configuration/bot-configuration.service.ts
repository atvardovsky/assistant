import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestBotConfigurations } from '../entity/bot_configurations.entity';

@Injectable()
export class BotConfigurationService {
  constructor(
    @InjectRepository(TestBotConfigurations)
    private readonly botConfigRepository: Repository<TestBotConfigurations>,
  ) {}

  async create(createBotConfigDto: { projectId: number; apiKey: string; assistantId: string; settings: string }): Promise<TestBotConfigurations> {
    const botConfig = this.botConfigRepository.create(createBotConfigDto);
    botConfig.createdAt = new Date();
    botConfig.updatedAt = new Date();
    return this.botConfigRepository.save(botConfig);
  }

  async findById(configId: number): Promise<TestBotConfigurations | null> {
    return this.botConfigRepository.findOne({ where: { configId } });
  }

  async update(configId: number, updateBotConfigDto: { apiKey?: string; assistantId?: string; settings?: string }): Promise<TestBotConfigurations> {
    await this.botConfigRepository.update(configId, updateBotConfigDto);
    return this.findById(configId);
  }

  async remove(configId: number): Promise<void> {
    await this.botConfigRepository.delete(configId);
  }
}
