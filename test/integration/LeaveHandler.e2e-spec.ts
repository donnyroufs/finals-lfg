import { EntityManager } from '@mikro-orm/core';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/database/DatabaseModule';
import { CannotLeaveException } from 'src/modules/contestants/domain/CannotLeaveException';
import { Contestant } from 'src/modules/contestants/domain/Contestant';
import { JoinHandler } from 'src/modules/contestants/features/join/JoinHandler';
import { LeaveCommand } from 'src/modules/contestants/features/leave/LeaveCommand';
import { LeaveHandler } from 'src/modules/contestants/features/leave/LeaveHandler';
import { LeaveModule } from 'src/modules/contestants/features/leave/LeaveModule';
import { GUID } from 'src/shared-kernel/ddd/GUID';

describe('leave handler', () => {
  let app: NestApplication;
  let handler: JoinHandler;
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
      const command = new LeaveCommand(contestant.userId);
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
      const command = new LeaveCommand(contestant.userId);
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
