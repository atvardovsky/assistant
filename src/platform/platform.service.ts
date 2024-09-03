import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUserPlatforms } from '../entity/user_platforms.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(TestUserPlatforms)
    private readonly platformRepository: Repository<TestUserPlatforms>,
  ) {}

  async create(createPlatformDto: { userId: number; platform: string; platformUserId: string }): Promise<TestUserPlatforms> {
    const platform = this.platformRepository.create(createPlatformDto);
    platform.createdAt = new Date();
    platform.updatedAt = new Date();
    return this.platformRepository.save(platform);
  }

  async findByUserId(userId: number): Promise<TestUserPlatforms[]> {
    return this.platformRepository.find({ where: { userId } });
  }

  async findByPlatformId(platformUserId: string): Promise<TestUserPlatforms | null> {
    return this.platformRepository.findOne({ where: { platformUserId } });
  }

  async update(platformId: number, updatePlatformDto: { platform?: string; platformUserId?: string }): Promise<TestUserPlatforms> {
    await this.platformRepository.update(platformId, updatePlatformDto);
    return this.platformRepository.findOne({ where: { userPlatformId: platformId } });
  }

  async remove(platformId: number): Promise<void> {
    await this.platformRepository.delete(platformId);
  }
}