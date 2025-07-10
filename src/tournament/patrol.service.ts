import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Patrol } from './patrol.entity';
import { PatrolMember } from './patrol-member.entity';
import { PatrolRole } from './patrol-member.entity';

@Injectable()
export class PatrolService {
  constructor(private readonly em: EntityManager) {}

  async create(data: Partial<Patrol>): Promise<Patrol> {
    if (!data.name || !data.tournament || !data.leader) {
      throw new BadRequestException('Name, tournament, and leader are required');
    }
    
    const patrol = this.em.create(Patrol, data as any);
    await this.em.persistAndFlush(patrol);
    return patrol;
  }

  async findAll(): Promise<Patrol[]> {
    return this.em.find(Patrol, {}, {
      populate: ['leader', 'members', 'tournament']
    });
  }

  async findById(id: string): Promise<Patrol> {
    const patrol = await this.em.findOne(Patrol, { id }, {
      populate: ['leader', 'members', 'tournament']
    });
    
    if (!patrol) {
      throw new NotFoundException('Patrol not found');
    }
    
    return patrol;
  }

  async findByTournament(tournamentId: string): Promise<Patrol[]> {
    return this.em.find(Patrol, { tournament: tournamentId }, {
      populate: ['leader', 'members']
    });
  }

  async update(id: string, data: Partial<Patrol>): Promise<Patrol> {
    const patrol = await this.findById(id);
    
    Object.assign(patrol, data);
    patrol.updatedAt = new Date();
    
    await this.em.persistAndFlush(patrol);
    return patrol;
  }

  async remove(id: string): Promise<void> {
    const patrol = await this.findById(id);
    await this.em.removeAndFlush(patrol);
  }

  async addMember(patrolId: string, userId: string, role: PatrolRole): Promise<PatrolMember> {
    const member = this.em.create(PatrolMember, {
      patrol: patrolId,
      user: userId,
      role,
      createdAt: new Date()
    });
    await this.em.persistAndFlush(member);
    return member;
  }

  async removeMember(patrolId: string, userId: string): Promise<void> {
    await this.em.nativeDelete(PatrolMember, { patrol: patrolId, user: userId });
  }
} 