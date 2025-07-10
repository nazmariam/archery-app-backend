import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tournament } from './tournament.entity';
import { Patrol } from './patrol.entity';
import { PatrolMember } from './patrol-member.entity';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PatrolService } from './patrol.service';
import { PatrolController } from './patrol.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Tournament, Patrol, PatrolMember])],
  providers: [TournamentService, PatrolService],
  controllers: [TournamentController, PatrolController],
  exports: [MikroOrmModule],
})
export class TournamentModule {} 