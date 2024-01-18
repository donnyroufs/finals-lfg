import { EntityManager } from '@mikro-orm/core';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ContestantJoinedEvent } from 'src/modules/contestant/domain/ContestantJoinedEvent';
import { GroupMatchingService } from '../../domain/GroupMatchingService';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { DateService } from 'src/shared-kernel/DateService';

@EventsHandler(ContestantJoinedEvent)
export class AfterContestantJoinedFindGroupHandler
  implements IEventHandler<ContestantJoinedEvent>
{
  public constructor(
    private readonly orm: MikroORM,
    private readonly _em: EntityManager,
    private readonly _dateService: DateService,
  ) {}

  @CreateRequestContext()
  public async handle(event: ContestantJoinedEvent): Promise<void> {
    const contestant = await this._em.findOneOrFail(Contestant, {
      id: event.contestantId,
    });
    const contestants = await this._em.findAll(Contestant, {
      where: {
        joined: true,
      },
    });

    const result = GroupMatchingService.findMatch(
      contestant,
      contestants,
      this._dateService.now(),
    );

    if (!result) return;

    await this._em.persistAndFlush(result);
  }
}
