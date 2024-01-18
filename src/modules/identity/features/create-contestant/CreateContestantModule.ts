import { Module } from '@nestjs/common';
import { CreateContestantController } from './CreateContestantController';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Contestant } from 'src/modules/contestant/domain/Contestant';

@Module({
  controllers: [CreateContestantController],
  imports: [MikroOrmModule.forFeature([Contestant])],
})
export class CreateContestantModule {}
