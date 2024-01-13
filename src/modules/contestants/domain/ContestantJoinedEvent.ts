import { GUID } from 'src/shared-kernel/ddd/GUID';
import { IDomainEvent } from 'src/shared-kernel/ddd/IDomainEvent';

export class ContestantJoinedEvent implements IDomainEvent {
  public constructor(
    public readonly id: GUID,
    public readonly occuredOn: Date,
  ) {}
}
