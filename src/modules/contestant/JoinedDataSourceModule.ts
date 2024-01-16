import { Module } from '@nestjs/common';

export const JoinedDataSourceToken = Symbol('JoinedDataSource');

@Module({
  providers: [
    {
      provide: JoinedDataSourceToken,
      useValue: new Map<string, string>(),
    },
  ],
  exports: [JoinedDataSourceToken],
})
/**
 * A quick and dirty solution to track connected sockets and their user id.
 */
export class JoinedDataSourceModule {}
