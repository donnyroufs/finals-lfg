import { EntityManager } from '@mikro-orm/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import * as supertest from 'supertest';
import { CreateContestantModule } from 'src/modules/identity/features/create-contestant/CreateContestantModule';
import { DatabaseModule } from 'src/shared-kernel/database/DatabaseModule';

describe('CreateContestantController', () => {
  let app: NestExpressApplication;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CreateContestantModule, DatabaseModule.forTests(true)],
    }).compile();

    em = moduleRef.get(EntityManager);
    app = moduleRef.createNestApplication();

    await app.listen(5000);
  });

  test('Creates a new contestant', async () => {
    const res = await supertest(app.getHttpServer()).post('/users').send({
      userId: 'my-user',
      email: '',
    });

    const confirmation = await em.findOne(Contestant, {
      userId: 'my-user',
    });
    expect(res.status).toBe(201);
    expect(confirmation).toBeInstanceOf(Contestant);
    expect(confirmation?.userId).toBe('my-user');
  });

  afterEach(async () => {
    await em.nativeDelete(Contestant, {});
    await app.close();
  });
});
