import { Migration } from '@mikro-orm/migrations';

export class Migration20240112120333 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "contestants" ("id" uuid not null, "joined" boolean not null, "userId" varchar not null, constraint "contestants_pkey" primary key ("id"));');
  }

}
