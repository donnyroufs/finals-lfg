import { Module } from '@nestjs/common';
import { JoinModule } from './features/join/JoinModule';

@Module({
  imports: [JoinModule],
  providers: [],
})
export class ContestantsModule {}
