import { EntityManager } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io-client';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { createAuthGuardStub, createClient, waitForEvent } from '../utils';
import { LeaveModule } from 'src/modules/contestant/features/leave/LeaveModule';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { User } from 'src/modules/identity/User';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { DatabaseModule } from 'src/shared-kernel/database/DatabaseModule';

describe('LeaveGateway', () => {
  const sockets: Socket[] = [];
  const USER: User = {
    email: 'email',
    id: 'google:id',
    contestantId: GUID.new(),
  };
  const guard = createAuthGuardStub(USER);
  let client: Socket;
  let app: NestExpressApplication;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LeaveModule, DatabaseModule.forTests(true)],
    })
      .overrideGuard(AuthGuard)
      .useValue(guard)
      .compile();

    em = moduleRef.get(EntityManager);
    app = moduleRef.createNestApplication();

    await app.listen(5000);

    const contestant = Contestant.create(true, USER.id);
    await em.persistAndFlush(contestant);
    client = createClient(sockets);
  });

  test('Emits that we left', async () => {
    client.emit('leave', {});
    await waitForEvent('left', client);
  });

  test.todo('When disconnected we remove the contestant from the pool');

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    sockets.forEach((socket) => socket.close());
    await app.close();
  });
});
