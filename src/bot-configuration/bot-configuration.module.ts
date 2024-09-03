import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestBotConfigurations } from '../entity/bot_configurations.entity';
import { BotConfigurationService } from './bot-configuration.service';
import { BotConfigurationController } from './bot-configuration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestBotConfigurations])],
  providers: [BotConfigurationService],
  controllers: [BotConfigurationController],
  exports: [BotConfigurationService],
})
export class BotConfigurationModule {}
