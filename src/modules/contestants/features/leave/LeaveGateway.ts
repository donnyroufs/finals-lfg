import { UseFilters } from '@nestjs/common';
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LeaveGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private readonly _server: Server;

  public constructor(private readonly _commandBus: CommandBus) {}

  public async handleDisconnect(client: Socket): Promise<void> {
    await this._commandBus.execute(new LeaveCommand('user-id'));
  }

  @SubscribeMessage('leave')
  public async handle(@ConnectedSocket() socket: Socket): Promise<void> {
    await this._commandBus.execute(new LeaveCommand('user-id'));
    socket.emit('left');
  }
}
