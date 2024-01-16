import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { Contestant } from 'src/modules/contestant/domain/Contestant';

@Controller('users')
export class CreateContestantController {
  private readonly _logger = new Logger(CreateContestantController.name);

  public constructor(private readonly _em: EntityManager) {}

  @Post()
  public async handle(@Body() body: any): Promise<void> {
    const exists = await this._em.findOne(Contestant, {
      userId: body.userId,
    });

    if (exists != null) return;
    this._logger.log('Creating new contestant', { userId: body.userId });

    const contestant = Contestant.create(false, body.userId);
    await this._em.persistAndFlush(contestant);
  }
}
