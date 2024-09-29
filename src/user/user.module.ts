import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUsers } from '../entity/users.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OpenAIModule } from 'src/openai/openai.module';
import { PlatformModule } from 'src/platform/platform.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestUsers]),
    forwardRef(() => OpenAIModule),
    forwardRef(() => PlatformModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
