import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestProjects } from '../entity/projects.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TestUsers } from 'src/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestProjects, TestUsers])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
