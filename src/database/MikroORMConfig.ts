import 'dotenv/config';

import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as path from 'path';
import { Contestant } from '../modules/contestants/domain/Contestant';
import { DomainEventsSubscriber } from './DomainEventsSubscriber';

export default defineConfig({
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  entities: [Contestant],
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
});
