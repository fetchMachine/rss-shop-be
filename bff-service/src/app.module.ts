import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProxyModule } from './proxy';
@Module({
  imports: [ConfigModule.forRoot(), ProxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
