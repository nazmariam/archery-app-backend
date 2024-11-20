import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './types';

@Injectable()
export class UserService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.entityManager.create(User, {
      ...userData,
      role: userData.role || Roles.User,
      createdAt: new Date(),
    });

    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.entityManager.findOne(User, { email });
  }
}
