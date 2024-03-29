import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { DateService } from 'src/shared-kernel/DateService';
import { JoinHandler } from './JoinHandler';
import { Contestant } from '../../domain/Contestant';
import { JoinGateway } from './JoinGateway';
import { JoinedDataSourceModule } from '../../../../shared-kernel/gateway/JoinedDataSourceModule';

@Module({
  imports: [
    MikroOrmModule.forFeature([Contestant]),
    CqrsModule,
    JoinedDataSourceModule,
  ],
  providers: [JoinHandler, DateService, JoinGateway],
})
export class JoinModule {}
