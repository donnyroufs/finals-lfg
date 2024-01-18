import { Module } from '@nestjs/common';
import { AfterGroupCreatedNotifyClientsHandler } from './AfterGroupCreatedNotifyClientsHandler';
import { JoinedDataSourceModule } from 'src/shared-kernel/gateway/JoinedDataSourceModule';
import { AfterGroupCreatedResetContestantsHandler } from './AfterGroupCreatedResetContestantsHandler';

@Module({
  imports: [JoinedDataSourceModule],
  providers: [
    AfterGroupCreatedNotifyClientsHandler,
    AfterGroupCreatedResetContestantsHandler,
  ],
})
export class GroupFoundModule {}
