import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';

import type { AlreadyJoinedException } from '../../domain/AlreadyJoinedException';
import { Contestant } from '../../domain/Contestant';
import { JoinCommand } from './JoinCommand';
import { DateService } from 'src/shared-kernel/DateService';

@CommandHandler(JoinCommand)
export class JoinHandler implements ICommandHandler<JoinCommand> {
  public constructor(
    private readonly _em: EntityManager,
    private readonly _dateService: DateService,
  ) {}

  /**
   * @throws {AlreadyJoinedException} Contestant has already joined
   */
  public async execute(command: JoinCommand): Promise<void> {
    const contestant = await this._em.findOneOrFail(Contestant, {
      userId: command.userId,
    });

    contestant.join(this._dateService.now());

    await this._em.flush();
  }
}
