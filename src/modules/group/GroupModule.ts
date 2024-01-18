import { Module } from '@nestjs/common';
import { FindGroupModule } from './features/find-group/FIndGroupModule';
import { GroupFoundModule } from './features/group-found/GroupFoundModule';

@Module({
  imports: [FindGroupModule, GroupFoundModule],
})
export class GroupModule {}
