import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUsers } from 'src/entity/users.entity';
import { TestUserPlatforms } from 'src/entity/user_platforms.entity';
import { PlatformModule } from 'src/platform/platform.module';
import { TestBotConfigurations } from 'src/entity/bot_configurations.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestUsers, TestUserPlatforms, TestBotConfigurations]),
    HttpModule,
    PlatformModule,
    JwtModule,
  ],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
