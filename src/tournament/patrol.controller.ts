import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as UserRoles } from '../user/types';

@Controller('patrols')
export class PatrolController {
  constructor(private readonly patrolService: PatrolService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Post()
  async create(@Body() data: any) {
    return this.patrolService.create(data);
  }

  @Get()
  async findAll() {
    return this.patrolService.findAll();
  }

  @Get('tournament/:tournamentId')
  async findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.patrolService.findByTournament(tournamentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patrolService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.patrolService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.patrolService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Post(':patrolId/members')
  async addMember(
    @Param('patrolId') patrolId: string,
    @Body() data: { userId: string; role: string }
  ) {
    return this.patrolService.addMember(patrolId, data.userId, data.role as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Delete(':patrolId/members/:userId')
  async removeMember(
    @Param('patrolId') patrolId: string,
    @Param('userId') userId: string
  ) {
    return this.patrolService.removeMember(patrolId, userId);
  }
} 