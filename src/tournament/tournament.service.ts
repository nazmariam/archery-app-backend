import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Tournament } from './tournament.entity';

@Injectable()
export class TournamentService {
  constructor(private readonly em: EntityManager) {}

  async create(data: Partial<Tournament>): Promise<Tournament> {
    if (!data.title || !data.startDate || !data.endDate || !data.createdBy) {
      throw new BadRequestException('Title, startDate, endDate, and createdBy are required');
    }
    
    const tournament = this.em.create(Tournament, data as any);
    await this.em.persistAndFlush(tournament);
    return tournament;
  }

  async findAll(): Promise<Tournament[]> {
    return this.em.find(Tournament, {}, {
      populate: ['createdBy', 'patrols']
    });
  }

  async findById(id: string): Promise<Tournament> {
    const tournament = await this.em.findOne(Tournament, { id }, {
      populate: ['createdBy', 'patrols']
    });
    
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    
    return tournament;
  }

  async update(id: string, data: Partial<Tournament>): Promise<Tournament> {
    const tournament = await this.findById(id);
    
    Object.assign(tournament, data);
    tournament.updatedAt = new Date();
    
    await this.em.persistAndFlush(tournament);
    return tournament;
  }

  async remove(id: string): Promise<void> {
    const tournament = await this.findById(id);
    await this.em.removeAndFlush(tournament);
  }
} 