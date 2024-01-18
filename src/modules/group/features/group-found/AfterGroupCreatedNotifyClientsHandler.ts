import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupCreatedEvent } from '../../domain/GroupCreatedEvent';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRequestContext, EntityManager, MikroORM } from '@mikro-orm/core';
import { Group } from '../../domain/Group';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { SocketsDataSource } from 'src/shared-kernel/gateway/JoinedDataSourceModule';
import { GroupDto } from './GroupDto';

@EventsHandler(GroupCreatedEvent)
@WebSocketGateway()
export class AfterGroupCreatedNotifyClientsHandler
  implements IEventHandler<GroupCreatedEvent>
{
  @WebSocketServer()
  private readonly _server: Server;

  public constructor(
    private readonly _source: SocketsDataSource,
    private readonly _em: EntityManager,
    private readonly orm: MikroORM,
  ) {}

  @CreateRequestContext()
  public async handle(event: GroupCreatedEvent): Promise<void> {
    const group = await this._em.findOne(Group, {
      id: event.groupId,
    });

    if (!group) return;

    for (const member of group.members) {
      const socket = this.findSocketByValue(member.contestantId);

      if (!socket) continue;

      socket.join(group.id.value);
    }

    this._server.to(group.id.value).emit('group-found', GroupDto.from(group));
  }

  private findSocketByValue(targetValue: GUID): Socket | null {
    for (const [socket, value] of this._source.entries()) {
      if (value.equals(targetValue)) {
        return socket;
      }
    }

    return null;
  }
}
