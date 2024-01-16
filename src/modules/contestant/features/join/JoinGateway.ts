import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JoinCommand } from './JoinCommand';
import { JoinExceptionFilter } from './JoinExceptionFilter';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { User } from 'src/modules/identity/User';
import { CreateRequestContext } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { JoinedDataSourceToken } from '../../JoinedDataSourceModule';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class JoinGateway {
  @WebSocketServer()
  private readonly _server: Server;

  public constructor(
    private readonly _commandBus: CommandBus,
    private readonly orm: MikroORM,
    @Inject(JoinedDataSourceToken)
    private readonly _joinedDataSource: Map<string, string>,
  ) {}

  @UseFilters(JoinExceptionFilter)
  @UseGuards(AuthGuard)
  @SubscribeMessage('join')
  @CreateRequestContext()
  public async handle(
    @ConnectedSocket() socket: Socket,
    @User() user: User,
  ): Promise<void> {
    await this._commandBus.execute(new JoinCommand(user.id));
    this._joinedDataSource.set(socket.id, user.id);
    socket.emit('joined');
  }
}
