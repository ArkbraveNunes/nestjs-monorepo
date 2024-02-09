import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import app from './config/app.config';
import database from './config/database.config';
import { AppConfigModule } from '@libs/config';
import { RequestContextModule } from '@common/request-context';
import { MongoDatabaseModule } from '@libs/database';

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
    RequestContextModule,
  ],
  providers: [],
  exports: [AppConfigModule, RequestContextModule],
})
export class CommonModule {}
