import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TestProjects } from '../entity/projects.entity';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { TestUsers } from 'src/entity/users.entity';
import { AdminGuard } from '../auth/admin.guard';

@Controller('projects')
@UseGuards(AdminGuard)
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

  @Get()
  async findAll(): Promise<TestProjects[]> {
    return this.projectService.findAll();
  }

  @Get(':projectId/users')
  async findUsersByProjectId(@Param('projectId') projectId: number): Promise<TestUsers[]> {
    return this.projectService.findUsersByProjectId(projectId);
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