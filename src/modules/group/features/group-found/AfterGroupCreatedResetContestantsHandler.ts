import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupCreatedEvent } from '../../domain/GroupCreatedEvent';
import { CreateRequestContext, EntityManager, MikroORM } from '@mikro-orm/core';
import { Group } from '../../domain/Group';
import { Contestant } from 'src/modules/contestant/domain/Contestant';

@EventsHandler(GroupCreatedEvent)
export class AfterGroupCreatedResetContestantsHandler
  implements IEventHandler<GroupCreatedEvent>
{
  public constructor(
    private orm: MikroORM,
    private readonly _em: EntityManager,
  ) {}

  @CreateRequestContext()
  public async handle(event: GroupCreatedEvent): Promise<void> {
    const group = await this._em.findOneOrFail(Group, {
      id: event.groupId,
    });

    for (const member of group.members) {
      const contestant = await this._em.findOne(Contestant, {
        id: member.contestantId,
      });

      if (!contestant) continue;

      contestant.foundGroup();
    }

    await this._em.flush();
  }
}
