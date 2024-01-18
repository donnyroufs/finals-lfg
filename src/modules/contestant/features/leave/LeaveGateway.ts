import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { LeaveCommand } from './LeaveCommand';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { User } from 'src/modules/identity/User';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { SocketsDataSource } from '../../../../shared-kernel/gateway/JoinedDataSourceModule';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LeaveGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private readonly _server: Server;

  public constructor(
    private readonly _commandBus: CommandBus,
    private readonly orm: MikroORM,
    private readonly _source: SocketsDataSource,
  ) {}

  @CreateRequestContext()
  public async handleDisconnect(socket: Socket): Promise<void> {
    const contestantId = this._source.get(socket);

    if (!contestantId) return;

    await this._commandBus.execute(new LeaveCommand(contestantId));
  }

  @SubscribeMessage('leave')
  @UseGuards(AuthGuard)
  @CreateRequestContext()
  public async handle(
    @ConnectedSocket() socket: Socket,
    @User() user: User,
  ): Promise<void> {
    await this._commandBus.execute(new LeaveCommand(user.contestantId));
    socket.emit('left');
  }
}
