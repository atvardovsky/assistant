import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUsers } from '../entity/test_users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(TestUsers)
    private readonly userRepository: Repository<TestUsers>,
  ) {}

  async create(createUserDto: { username: string; projectId: number }): Promise<TestUsers> {
    const user = this.userRepository.create(createUserDto);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return this.userRepository.save(user);
  }

  async findById(userId: number): Promise<TestUsers | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async findByUsername(username: string): Promise<TestUsers | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(userId: number, updateUserDto: { username?: string; projectId?: number }): Promise<TestUsers> {
    await this.userRepository.update(userId, updateUserDto);
    return this.findById(userId);
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
