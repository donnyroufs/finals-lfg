import { ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AlreadyJoinedException } from '../../domain/AlreadyJoinedException';
import { BaseExceptionFilter } from '@nestjs/core';

export class JoinExceptionFilter extends BaseExceptionFilter {
  public catch(exception: AlreadyJoinedException, host: ArgumentsHost): void {
    const ws = host.switchToWs().getClient<Socket>();

    if (!(exception instanceof AlreadyJoinedException)) {
      return super.catch(exception, host);
    }

    ws.emit('already-joined');
  }
}
