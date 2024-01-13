import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import MikroORMConfig from './MikroORMConfig';
import { DomainEventsSubscriber } from './DomainEventsSubscriber';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [MikroOrmModule.forRoot(MikroORMConfig), CqrsModule],
  providers: [DomainEventsSubscriber],
})
export class DatabaseModule {
  public static forTests(allowGlobalContext: boolean = false): any {
    return MikroOrmModule.forRoot({
      ...MikroORMConfig,
      dbName: 'finalshq-dev',
      user: 'postgres',
      password: 'postgres',
      allowGlobalContext,
    });
  }
}
