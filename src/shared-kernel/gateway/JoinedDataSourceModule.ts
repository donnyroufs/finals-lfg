import { Module } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class SocketsDataSource extends Map<Socket, GUID> {}

@Module({
  providers: [SocketsDataSource],
  exports: [SocketsDataSource],
})
export class JoinedDataSourceModule {}
