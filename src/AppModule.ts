import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { ContestantsModule } from './modules/contestant/ContestantsModule';
import { IdentityModule } from './modules/identity/IdentityModule';
import { GroupModule } from './modules/group/GroupModule';
import { DatabaseModule } from './shared-kernel/database/DatabaseModule';

@Module({
  imports: [DatabaseModule, ContestantsModule, IdentityModule, GroupModule],
})
export class AppModule implements OnApplicationBootstrap {
  public onApplicationBootstrap(): void {
    const keys = [
      process.env.DATABASE_NAME,
      process.env.DATABASE_PASSWORD,
      process.env.DATABASE_USER,
      process.env.PORT,
      process.env.AUTH_AUDIENCE,
      process.env.AUTH_ISSUES_BASE_URL,
      process.env.AUTH_TOKEN_ALGORITHM,
    ].filter((env) => env == null || env === '');

    if (keys.length > 0)
      throw new Error(`Missing configuration (${keys.join(', ')})`);
  }
}
