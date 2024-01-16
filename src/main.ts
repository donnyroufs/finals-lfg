import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(+process.env.PORT);
}

bootstrap();
