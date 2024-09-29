import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUserPlatforms } from '../entity/user_platforms.entity';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestUserPlatforms]),
    forwardRef(() => AuthModule),
  ],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [PlatformService, TypeOrmModule.forFeature([TestUserPlatforms])],
})
export class PlatformModule {}
