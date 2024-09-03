import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUsers } from 'src/entity/users.entity';
import { TestUserPlatforms } from 'src/entity/user_platforms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestUsers, TestUserPlatforms]),
    HttpModule,
  ],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}