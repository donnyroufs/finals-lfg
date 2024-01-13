import { UseFilters } from '@nestjs/common';
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class JoinGateway {
  @WebSocketServer()
  private readonly _server: Server;

  public constructor(private readonly _commandBus: CommandBus) {}

  @UseFilters(JoinExceptionFilter)
  @SubscribeMessage('join')
  public async handle(@ConnectedSocket() socket: Socket): Promise<void> {
    await this._commandBus.execute(new JoinCommand('user-id'));
    socket.emit('joined');
  }
}
