import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestProjects } from '../entity/projects.entity';
import { TestUsers } from 'src/entity/users.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(TestProjects)
    private readonly projectRepository: Repository<TestProjects>,
    @InjectRepository(TestUsers)
    private readonly userRepository: Repository<TestUsers>, // Inject the user repository
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

  async findAll(): Promise<TestProjects[]> {
    return this.projectRepository.find();
  }

  async update(projectId: number, updateProjectDto: { projectName?: string }): Promise<TestProjects> {
    await this.projectRepository.update(projectId, updateProjectDto);
    return this.findById(projectId);
  }

  async remove(projectId: number): Promise<void> {
    await this.projectRepository.delete(projectId);
  }

  async findUsersByProjectId(projectId: number): Promise<TestUsers[]> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ['users'], // Load related users
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project.users;
  }
}