import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(+process.env.PORT);
}

bootstrap();
