import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TestProjects } from '../entity/projects.entity';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<TestProjects> {
    return this.projectService.create(createProjectDto);
  }

  @Get(':projectId')
  async findById(@Param('projectId') projectId: number): Promise<TestProjects> {
    return this.projectService.findById(projectId);
  }

  @Put(':projectId')
  async update(@Param('projectId') projectId: number, @Body() updateProjectDto: UpdateProjectDto): Promise<TestProjects> {
    return this.projectService.update(projectId, updateProjectDto);
  }

  @Delete(':projectId')
  async remove(@Param('projectId') projectId: number): Promise<void> {
    return this.projectService.remove(projectId);
  }
}
