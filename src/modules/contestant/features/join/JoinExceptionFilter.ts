import { ArgumentsHost, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AlreadyJoinedException } from '../../domain/AlreadyJoinedException';
import { BaseExceptionFilter } from '@nestjs/core';

export class JoinExceptionFilter extends BaseExceptionFilter {
  private readonly _logger = new Logger(JoinExceptionFilter.name);

  public catch(exception: AlreadyJoinedException, host: ArgumentsHost): void {
    this._logger.warn(exception.message);
    const ws = host.switchToWs().getClient<Socket>();

    if (!(exception instanceof AlreadyJoinedException)) {
      return super.catch(exception, host);
    }

    ws.emit('already-joined');
  }
}
