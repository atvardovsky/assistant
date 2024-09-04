import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUsers } from '../entity/users.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OpenAIModule } from 'src/openai/openai.module';
import { PlatformService } from 'src/platform/platform.service';
import { PlatformModule } from 'src/platform/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestUsers]),
    OpenAIModule,
    PlatformModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
