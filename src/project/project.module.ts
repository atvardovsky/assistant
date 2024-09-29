import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestProjects } from '../entity/projects.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TestUsers } from 'src/entity/users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestProjects, TestUsers]),
    AuthModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
