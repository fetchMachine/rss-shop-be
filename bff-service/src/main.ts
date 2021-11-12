import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const appPort = process.env.SERVER_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(appPort);
}

bootstrap();
