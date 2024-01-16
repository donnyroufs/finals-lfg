import { Module } from '@nestjs/common';
import { CreateContestantModule } from './features/create-contestant/CreateContestantModule';

@Module({
  imports: [CreateContestantModule],
})
export class IdentityModule {}
