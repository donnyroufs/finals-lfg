import { IDomainEvent } from 'src/shared-kernel/ddd/IDomainEvent';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class GroupCreatedEvent implements IDomainEvent {
  public constructor(
    public readonly memberIds: GUID[],
    public readonly groupId: GUID,
    public readonly occuredOn: Date,
  ) {}
}
