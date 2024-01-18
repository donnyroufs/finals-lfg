import { Migration } from '@mikro-orm/migrations';

export class Migration20240117082507 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "contestants" ("id" uuid not null, "joined" boolean not null, "userId" varchar not null, constraint "contestants_pkey" primary key ("id"));');
    this.addSql('alter table "contestants" add constraint "contestants_userId_unique" unique ("userId");');

    this.addSql('create table "group" ("id" uuid not null, constraint "group_pkey" primary key ("id"));');

    this.addSql('create table "group_members" ("id" uuid not null, "contestant_id" uuid not null, "group_id" uuid not null, constraint "group_members_pkey" primary key ("id"));');

    this.addSql('alter table "group_members" add constraint "group_members_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group_members" drop constraint "group_members_group_id_foreign";');

    this.addSql('drop table if exists "contestants" cascade;');

    this.addSql('drop table if exists "group" cascade;');

    this.addSql('drop table if exists "group_members" cascade;');
  }

}
