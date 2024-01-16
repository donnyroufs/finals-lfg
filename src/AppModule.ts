import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { DatabaseModule } from './database/DatabaseModule';
import { ContestantsModule } from './modules/contestant/ContestantsModule';
import { IdentityModule } from './modules/identity/IdentityModule';

@Module({
  imports: [DatabaseModule, ContestantsModule, IdentityModule],
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
