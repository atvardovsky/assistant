import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUserPlatforms } from '../entity/user_platforms.entity';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestUserPlatforms])],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [PlatformService, TypeOrmModule.forFeature([TestUserPlatforms])],
})
export class PlatformModule {}
