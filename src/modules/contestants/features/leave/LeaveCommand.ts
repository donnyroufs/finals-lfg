import { ICommand } from '@nestjs/cqrs';

export class LeaveCommand implements ICommand {
  public constructor(public readonly userId: string) {}
}
