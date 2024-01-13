import { EntityManager } from '@mikro-orm/core';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { DatabaseModule } from 'src/database/DatabaseModule';
import { AlreadyJoinedException } from 'src/modules/contestants/domain/AlreadyJoinedException';
import { Contestant } from 'src/modules/contestants/domain/Contestant';
import { JoinCommand } from 'src/modules/contestants/features/join/JoinCommand';
import { JoinHandler } from 'src/modules/contestants/features/join/JoinHandler';
import { JoinModule } from 'src/modules/contestants/features/join/JoinModule';
import { GUID } from 'src/shared-kernel/ddd/GUID';

describe('JoinHandler', () => {
  let app: NestApplication;
  let handler: JoinHandler;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JoinModule, DatabaseModule.forTests(true)],
    }).compile();

    app = moduleRef.createNestApplication();
    em = moduleRef.get(EntityManager);
    handler = moduleRef.get(JoinHandler);
    await app.init();
  });

  describe('Given a contestant who has not joined', () => {
    const USER_ID = GUID.new().value;
    let contestant: Contestant;

    beforeEach(async () => {
      contestant = Contestant.create(false, USER_ID);
      await em.persistAndFlush(contestant);
    });

    test('When the contestant joins, Then the contestant is added to the group Finder', async () => {
      const command = new JoinCommand(contestant.userId);
      await handler.execute(command);

      const confirmation = await em.findOne(Contestant, { id: contestant.id });
      expect(confirmation?.joined).toBe(true);
    });
  });

  describe('Given a contestant who has already joined', () => {
    const USER_ID = GUID.new().value;
    let contestant: Contestant;

    beforeEach(async () => {
      contestant = Contestant.create(false, USER_ID);
      await em.persistAndFlush(contestant);
    });

    test('When the contestant tries to join, Then the contestant is told they have already joined', async () => {
      const command = new JoinCommand(contestant.userId);
      await handler.execute(command);
      const act = (): Promise<void> => handler.execute(command);

      await expect(act).rejects.toThrow(AlreadyJoinedException);
    });
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    await app.close();
  });
});