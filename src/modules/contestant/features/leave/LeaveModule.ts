import { Module } from '@nestjs/common';
import { LeaveHandler } from './LeaveHandler';
import { LeaveGateway } from './LeaveGateway';
import { CqrsModule } from '@nestjs/cqrs';
import { JoinedDataSourceModule } from '../../JoinedDataSourceModule';

@Module({
  imports: [CqrsModule, JoinedDataSourceModule],
  providers: [LeaveHandler, LeaveGateway],
})
export class LeaveModule {}
