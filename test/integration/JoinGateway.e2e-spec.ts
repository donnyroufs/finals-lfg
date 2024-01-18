import { EntityManager } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import {
  createAuthGuardStub,
  createClient,
  waitForEvent,
} from '../utils/index';

import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { JoinModule } from 'src/modules/contestant/features/join/JoinModule';
import { Socket } from 'socket.io-client';
import { User } from 'src/modules/identity/User';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { DatabaseModule } from 'src/shared-kernel/database/DatabaseModule';

describe('JoinGateway', () => {
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
      imports: [JoinModule, DatabaseModule.forTests(true)],
    })
      .overrideGuard(AuthGuard)
      .useValue(guard)
      .compile();

    em = moduleRef.get(EntityManager).fork();
    app = moduleRef.createNestApplication();

    await app.listen(5000);

    const contestant = Contestant.create(false, USER.id);
    await em.persistAndFlush(contestant);
    client = createClient(sockets);
  });

  test('Emits that we have joined', async () => {
    client.emit('join', {});
    await waitForEvent('joined', client);
  });

  test('Emits that we are already in the group finder', async () => {
    client.emit('join', {});
    client.emit('join', {});

    await Promise.all([
      waitForEvent('joined', client),
      waitForEvent('already-joined', client),
    ]);
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    sockets.forEach((socket) => socket.close());
    await app.close();
  });
});
