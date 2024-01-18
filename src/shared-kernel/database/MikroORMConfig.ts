import 'dotenv/config';

import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as path from 'path';
import { Contestant } from '../../modules/contestant/domain/Contestant';
import { Group } from '../../modules/group/domain/Group';
import { GroupMember } from '../../modules/group/domain/GroupMember';

export default defineConfig({
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  entities: [Contestant, Group, GroupMember],
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
});
