import { Module } from '@nestjs/common';
import { LeaveHandler } from './LeaveHandler';
import { LeaveGateway } from './LeaveGateway';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [LeaveHandler, LeaveGateway],
})
export class LeaveModule {}
