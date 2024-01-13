import { AggregateRoot } from 'src/shared-kernel/ddd/AggregateRoot';
import { IDomainEvent } from '../../src/shared-kernel/ddd/IDomainEvent';
import { GUID } from 'src/shared-kernel/ddd/GUID';

class Root extends AggregateRoot {}
class DomainEvent implements IDomainEvent {
  public constructor(
    public readonly id: GUID = GUID.new(),
    public readonly occuredOn: Date = new Date(),
  ) {}
}

describe('AggregateRoot', () => {
  test('Applies a domain event', () => {
    const root = new Root(GUID.new());

    const evt = new DomainEvent();
    root.apply(evt);

    expect(root.getDomainEvents()).toStrictEqual([evt]);
  });

  test('applies multiple events', () => {
    const root = new Root(GUID.new());

    const evt = new DomainEvent();
    const evt2 = new DomainEvent();
    root.apply(evt);
    root.apply(evt2);

    expect(root.getDomainEvents()).toStrictEqual([evt, evt2]);
  });

  test('Does not apply duplicate events', () => {
    const root = new Root(GUID.new());

    const evt = new DomainEvent();
    root.apply(evt);
    root.apply(evt);

    expect(root.getDomainEvents()).toStrictEqual([evt]);
  });

  test('clears the applied events', () => {
    const root = new Root(GUID.new());

    const evt = new DomainEvent();
    const evt2 = new DomainEvent();
    root.apply(evt);
    root.apply(evt2);
    root.commit();

    expect(root.getDomainEvents()).toStrictEqual([]);
  });
});
