import { EntityManager, MikroORM } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io-client';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { User } from 'src/modules/identity/User';
import { createAuthGuardStub, createClient, waitForEvent } from '../utils';
import { AppModule } from 'src/AppModule';
import { Group } from 'src/modules/group/domain/Group';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { GroupMember } from 'src/modules/group/domain/GroupMember';
import { GroupDto } from 'src/modules/group/features/group-found/GroupDto';

jest.setTimeout(2000);

const wait = (ms = 200): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

describe('Find a group acceptance', () => {
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
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(guard)
      .compile();

    em = moduleRef.get(EntityManager).fork();
    app = moduleRef.createNestApplication();
    orm = moduleRef.get(MikroORM);

    await app.listen(5000);

    await orm.schema.refreshDatabase();
    client = createClient(sockets);
  });

  describe('Given only one contestant has joined', () => {
    let me: Contestant;
    let contestant3: Contestant;

    beforeEach(async () => {
      me = Contestant.create(false, USER.id, USER.contestantId);
      const contestant2 = Contestant.create(false, 'user-2');
      contestant3 = Contestant.create(true, 'user-3');
      em.persist(me);
      em.persist(contestant2);
      em.persist(contestant3);
      await em.flush();
    });

    test('When I join, then I will not find a group', async () => {
      client.emit('join', {});
      await waitForEvent('joined', client);

      await wait();
      const groups = await em.find(Group, {});
      expect(groups).toHaveLength(0);
    });
  });

  describe('Given 2 contestants have joined', () => {
    let me: Contestant;
    let contestant2: Contestant;
    let contestant3: Contestant;

    beforeEach(async () => {
      me = Contestant.create(false, USER.id, USER.contestantId);
      contestant2 = Contestant.create(true, 'user-2');
      contestant3 = Contestant.create(true, 'user-3');
      em.persist(me);
      em.persist(contestant2);
      em.persist(contestant3);
      await em.flush();
    });

    // Should assert that everyone gets notified
    test('When I join, then I will find a group', async () => {
      client.emit('join', {});

      const [_, result]: [any, GroupDto] = await Promise.all([
        waitForEvent('joined', client),
        waitForEvent('group-found', client),
      ]);

      expect(result.members.map((member) => member.contestantId)).toEqual(
        expect.arrayContaining([
          me.id.value,
          contestant2.id.value,
          contestant3.id.value,
        ]),
      );
    });

    describe('And I have found a group', () => {
      beforeEach(async () => {
        client.emit('join', {});

        await Promise.all([
          waitForEvent('joined', client),
          waitForEvent('group-found', client),
        ]);
        await wait(100);
      });

      test('Then I can join again', async () => {
        client.emit('join', {});
        await waitForEvent('joined', client);
      });
    });
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    await em.nativeDelete(GroupMember, {});
    await em.nativeDelete(Group, {});
  });

  afterAll(async () => {
    sockets.forEach((socket) => socket.close());
    await app.close();
  });
});
