import { Module } from '@nestjs/common';
import { CreateContestantController } from './CreateContestantController';
import { DatabaseModule } from 'src/database/DatabaseModule';

@Module({
  controllers: [CreateContestantController],
  imports: [DatabaseModule],
})
export class CreateContestantModule {}
