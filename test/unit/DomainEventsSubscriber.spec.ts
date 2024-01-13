import { EventManager, FlushEventArgs, EntityManager } from '@mikro-orm/core';
import { EventBus } from '@nestjs/cqrs';
import { mock, mockDeep } from 'jest-mock-extended';
import { DomainEventsSubscriber } from 'src/database/DomainEventsSubscriber';
import { AggregateRoot } from 'src/shared-kernel/ddd/AggregateRoot';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { IDomainEvent } from 'src/shared-kernel/ddd/IDomainEvent';

describe('DomainEventsSubscriber', () => {
  test('Dispatches domain events when they are present', async () => {
    const em = mock<EntityManager>();
    const eventManager = mock<EventManager>();
    em.getEventManager.mockReturnValue(eventManager);
    const bus = mock<EventBus>();

    const subscriber = new DomainEventsSubscriber(em as any, bus);

    const testEntity = new TestEntity(GUID.new());
    const evt: IDomainEvent = {
      id: GUID.new(),
      occuredOn: new Date(),
    };
    testEntity.apply(evt);

    const args = mockDeep<FlushEventArgs>();
    args.uow.getChangeSets.mockReturnValue([
      {
        entity: testEntity,
      } as any,
    ]);

    await subscriber.afterFlush(args);

    expect(bus.publishAll).toHaveBeenCalledWith([evt]);
  });
});

class TestEntity extends AggregateRoot {}
