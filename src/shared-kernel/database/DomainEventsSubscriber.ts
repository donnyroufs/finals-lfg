import {
  EventSubscriber,
  FlushEventArgs,
  EntityManager,
} from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { AggregateRoot } from 'src/shared-kernel/ddd/AggregateRoot';

@Injectable()
export class DomainEventsSubscriber implements EventSubscriber {
  private readonly _logger = new Logger(DomainEventsSubscriber.name);

  public constructor(
    em: EntityManager,
    private readonly _bus: EventBus,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  public async afterFlush(args: FlushEventArgs): Promise<void> {
    const changeSetsWithEvents = args.uow
      .getChangeSets()
      .filter((x) => x.entity instanceof AggregateRoot)
      .filter((x) => x.entity.getDomainEvents().length > 0);

    for await (const changeSet of changeSetsWithEvents) {
      const events = changeSet.entity.getDomainEvents();
      changeSet.entity.commit();
      this._logger.log(
        `Dispatching domain events (${events
          .map((evt) => evt.constructor.name)
          .join(', ')}) from ${changeSet.entity.constructor.name}(${
          changeSet.entity.id
        })`,
      );
      await this._bus.publishAll(events);
    }
  }
}
