import { EntityManager } from '@mikro-orm/core';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { ContestantJoinedEvent } from 'src/modules/contestant/domain/ContestantJoinedEvent';
import { Group } from 'src/modules/group/domain/Group';
import { AfterContestantJoinedFindGroupHandler } from 'src/modules/group/features/find-group/AfterContestantJoinedFindGroupHandler';
import { FindGroupModule } from 'src/modules/group/features/find-group/FIndGroupModule';
import { TestContestantBuilder } from '../utils/TestContestantBuilder';
import { DatabaseModule } from 'src/shared-kernel/database/DatabaseModule';
import { GroupMember } from 'src/modules/group/domain/GroupMember';

const { aContestant } = TestContestantBuilder;

describe('AfterContestantJoinedFindGroupHandler', () => {
  const CONTESTANT = aContestant().asJoined().build();
  let app: NestApplication;
  let handler: AfterContestantJoinedFindGroupHandler;
  let em: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FindGroupModule, DatabaseModule.forTests(true)],
    }).compile();

    app = moduleRef.createNestApplication();
    em = moduleRef.get(EntityManager).fork();
    handler = moduleRef.get(AfterContestantJoinedFindGroupHandler);
    await em.persistAndFlush(CONTESTANT);
    await app.init();
  });

  test('Does not persist a group when there is no match', async () => {
    const evt = new ContestantJoinedEvent(CONTESTANT.id, new Date());
    await handler.handle(evt);

    const confirmation = await em.findAll(Group, {});
    expect(confirmation).toHaveLength(0);
  });

  test('Persists the group when there is a match', async () => {
    em.persist(aContestant().asJoined().build());
    em.persist(aContestant().asJoined().build());
    await em.flush();
    const evt = new ContestantJoinedEvent(CONTESTANT.id, new Date());
    await handler.handle(evt);

    const confirmation = await em.findAll(Group, {});
    expect(confirmation).toHaveLength(1);
  });

  afterAll(async () => {
    await em.nativeDelete(Contestant, {});
    await em.nativeDelete(GroupMember, {});
    await em.nativeDelete(Group, {});
    await app.close();
  });

  afterEach(async () => {
    await em.nativeDelete(GroupMember, {});
    await em.nativeDelete(Group, {});
  });
});
