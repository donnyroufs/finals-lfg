import { ICommand } from '@nestjs/cqrs';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class LeaveCommand implements ICommand {
  public constructor(public readonly contestantId: GUID) {}
}
