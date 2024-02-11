import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import app from './config/app.config';
import database from './config/database.config';
import { AppConfigModule } from '@libs/config';
import { RequestContextModule } from '@libs/request-context';
import { MongoDatabaseModule } from '@libs/database';
import { CryptographDataModule } from '@libs/cryptograph-data';
import { REQUEST_CONTEXT } from './enum';

@Module({
  imports: [
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
          property: 'headers',
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
  ],
})
export class CommonModule {}
