import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LeaveCommand } from './LeaveCommand';
import { EntityManager } from '@mikro-orm/postgresql';
import { Contestant } from '../../domain/Contestant';

@CommandHandler(LeaveCommand)
export class LeaveHandler implements ICommandHandler<LeaveCommand> {
  public constructor(private readonly _em: EntityManager) {}

  public async execute(command: LeaveCommand): Promise<void> {
    const contestant = await this._em.findOne(Contestant, {
      userId: command.userId,
    });

    if (!contestant) return;

    contestant.leave();

    await this._em.flush();
  }
}
