import { Module } from '@nestjs/common';
import { JoinModule } from './features/join/JoinModule';
import { LeaveModule } from './features/leave/LeaveModule';

@Module({
  imports: [JoinModule, LeaveModule],
  providers: [],
})
export class ContestantsModule {}
