import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestProjects } from '../entity/projects.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(TestProjects)
    private readonly projectRepository: Repository<TestProjects>,
  ) {}

  async create(createProjectDto: { projectName: string }): Promise<TestProjects> {
    const project = this.projectRepository.create(createProjectDto);
    project.createdAt = new Date();
    project.updatedAt = new Date();
    return this.projectRepository.save(project);
  }

  async findById(projectId: number): Promise<TestProjects | null> {
    return this.projectRepository.findOne({ where: { projectId } });
  }

  async update(projectId: number, updateProjectDto: { projectName?: string }): Promise<TestProjects> {
    await this.projectRepository.update(projectId, updateProjectDto);
    return this.findById(projectId);
  }

  async remove(projectId: number): Promise<void> {
    await this.projectRepository.delete(projectId);
  }
}
