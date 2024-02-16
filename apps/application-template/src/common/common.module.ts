import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import app from './config/app.config';
import { REQUEST_CONTEXT } from './enum';
import { LoggerModule } from '@libs/logger';
import { MomentModule } from '@libs/moment';
import { AppConfigModule } from '@libs/config';
import database from './config/database.config';
import { MongoDatabaseModule } from '@libs/database';
import { CryptographDataModule } from '@libs/cryptograph-data';
import { EventEmitterModule } from '@libs/event-emitter';
import { RequestContextModule, TYPE_PARAMETER } from '@libs/request-context';
import { UserListener } from '@common/listener';

@Module({
  imports: [
    LoggerModule,
    MomentModule,
    AppConfigModule.injectConfig({
      config: [app, database],
    }),
    MongoDatabaseModule.mongoDBConfig({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        mongoDbType: configService.get('database.type')
          ? `+${configService.get('database.type')}`
          : ``,
        mongoDbUsername: configService.get('database.username'),
        mongoDbPassword: configService.get('database.password'),
        mongoDbHost: configService.get('database.host'),
        mongoDbPort: configService.get('database.port'),
        mongoDbName: configService.get('database.database'),
      }),
    }),
    MongoDatabaseModule.mongoDBInit(),
    RequestContextModule.setParameters({
      parameters: [
        {
          name: REQUEST_CONTEXT.TENANT,
          type: TYPE_PARAMETER.HEADER,
        },
      ],
    }),
    CryptographDataModule.cryptographConfig({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        numberOfSalt: configService.get('cryptographPasswordSalt'),
      }),
    }),
    EventEmitterModule,
  ],
  providers: [UserListener],
  exports: [UserListener],
})
export class CommonModule {}
