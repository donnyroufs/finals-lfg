import { EntityManager } from '@mikro-orm/core';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { CannotLeaveException } from 'src/modules/contestant/domain/CannotLeaveException';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { LeaveCommand } from 'src/modules/contestant/features/leave/LeaveCommand';
import { LeaveHandler } from 'src/modules/contestant/features/leave/LeaveHandler';
import { LeaveModule } from 'src/modules/contestant/features/leave/LeaveModule';
import { DatabaseModule } from 'src/shared-kernel/database/DatabaseModule';
import { GUID } from 'src/shared-kernel/ddd/GUID';

describe('leave handler', () => {
  let app: NestApplication;
  let handler: LeaveHandler;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LeaveModule, DatabaseModule.forTests(true)],
    }).compile();

    app = moduleRef.createNestApplication();
    em = moduleRef.get(EntityManager);
    handler = moduleRef.get(LeaveHandler);
    await app.init();
  });

  describe('Given a contestant has not joined', () => {
    const USER_ID = GUID.new().value;
    let contestant: Contestant;

    beforeEach(async () => {
      contestant = Contestant.create(false, USER_ID);
      await em.persistAndFlush(contestant);
    });

    test('When the contestant tries to leave, Then the contestant is told they are not in the group finder', async () => {
      const command = new LeaveCommand(contestant.id);
      const act = (): Promise<void> => handler.execute(command);

      expect(act).rejects.toThrow(CannotLeaveException);
    });
  });

  describe('Given a contestant has joined', () => {
    const USER_ID = GUID.new().value;
    let contestant: Contestant;

    beforeEach(async () => {
      contestant = Contestant.create(true, USER_ID);
      await em.persistAndFlush(contestant);
    });

    test('When the contestant leaves, Then the contestant is removed from to the group Finder', async () => {
      const command = new LeaveCommand(contestant.id);
      await handler.execute(command);

      const confirmation = await em.findOne(Contestant, { id: contestant.id });
      expect(confirmation?.joined).toBe(false);
    });
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    await app.close();
  });
});
