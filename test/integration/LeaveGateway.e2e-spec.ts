import { EntityManager } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io-client';
import { DatabaseModule } from 'src/database/DatabaseModule';
import { Contestant } from 'src/modules/contestants/domain/Contestant';
import { createClient, waitForEvent } from '../utils';
import { LeaveModule } from 'src/modules/contestants/features/leave/LeaveModule';

const wait = (ms = 300): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

describe('LeaveGateway', () => {
  const sockets: Socket[] = [];
  let client: Socket;
  let app: NestExpressApplication;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LeaveModule, DatabaseModule.forTests(true)],
    }).compile();

    em = moduleRef.get(EntityManager);
    app = moduleRef.createNestApplication();

    await app.listen(5000);

    const contestant = Contestant.create(true, 'user-id');
    await em.persistAndFlush(contestant);
    client = createClient(sockets);
  });

  test('Emits that we left', async () => {
    client.emit('leave');
    await waitForEvent('left', client);
  });

  // TODO: figure out a way to do this without waiting.
  test('When the socket disconnects we leave the group finder', async () => {
    await wait(150);
    client.close();
    await wait(150);
    const result = await em.findOne(Contestant, { userId: 'user-id' });

    expect(result?.joined).toBe(false);
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    sockets.forEach((socket) => socket.close());
    await app.close();
  });
});
