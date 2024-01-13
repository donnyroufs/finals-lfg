import { EntityManager } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { DatabaseModule } from 'src/database/DatabaseModule';
import { Contestant } from 'src/modules/contestants/domain/Contestant';
import { JoinModule } from 'src/modules/contestants/features/join/JoinModule';
import { Socket, io } from 'socket.io-client';

async function waitForEvent<TResult = any>(
  evt: string,
  socket: Socket,
): Promise<TResult> {
  return new Promise((res) => {
    socket.on(evt, (data: TResult) => {
      return res(data);
    });
  });
}

function createClient(sockets: Socket[]): Socket {
  const socket = io('http://localhost:5000', { multiplex: false });
  sockets.push(socket);
  return socket;
}

describe('JoinGateway', () => {
  const sockets: Socket[] = [];
  let client: Socket;
  let app: NestExpressApplication;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JoinModule, DatabaseModule.forTests(true)],
    }).compile();

    em = moduleRef.get(EntityManager).fork();
    app = moduleRef.createNestApplication();

    await app.listen(5000);

    const contestant = Contestant.create(false, 'user-id');
    await em.persistAndFlush(contestant);
    client = createClient(sockets);
  });

  test('Emits that we have joined', async () => {
    client.emit('join');
    await waitForEvent('joined', client);
  });

  test('Emits that we are already in the group finder', async () => {
    client.emit('join');
    client.emit('join');

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
