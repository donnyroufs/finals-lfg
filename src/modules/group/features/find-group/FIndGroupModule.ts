import { Module } from '@nestjs/common';
import { AfterContestantJoinedFindGroupHandler } from './AfterContestantJoinedFindGroupHandler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Group } from '../../domain/Group';
import { GroupMember } from '../../domain/GroupMember';
import { DateService } from 'src/shared-kernel/DateService';

@Module({
  imports: [MikroOrmModule.forFeature([Group, GroupMember])],
  providers: [AfterContestantJoinedFindGroupHandler, DateService],
})
export class FindGroupModule {}
