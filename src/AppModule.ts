import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { DatabaseModule } from './database/DatabaseModule';

@Module({
  imports: [DatabaseModule],
})
export class AppModule implements OnApplicationBootstrap {
  public onApplicationBootstrap(): void {
    const keys = [
      process.env.DATABASE_NAME,
      process.env.DATABASE_PASSWORD,
      process.env.DATABASE_USER,
      process.env.PORT,
    ].filter((env) => env == null || env === '');

    if (keys.length > 0)
      throw new Error(`Missing configuration (${keys.join(', ')})`);
  }
}
