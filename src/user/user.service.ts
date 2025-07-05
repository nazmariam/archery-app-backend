import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(userData: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    let hashedPassword = undefined;
    if (userData.password) {
      if (userData.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    const user = this.entityManager.create(User, {
      ...userData,
      password: hashedPassword,
      role: userData.role || Roles.User,
      createdAt: new Date(),
    });

    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.entityManager.findOne(User, { email });
  }

  async findById(id: string): Promise<User | null> {
    return this.entityManager.findOne(User, { id });
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    user.updatedAt = new Date();

    await this.entityManager.persistAndFlush(user);
    return user;
  }
}
