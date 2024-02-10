import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { HeadersValidator } from '@libs/middleware';
import { LoggerModule } from '@libs/logger';
import { HealthCheckModule } from '@libs/healthcheck';
import { TenantHeaderInputDto } from '@libs/common-dto';
import { CommonModule } from '@common/common.module';
import { ApplicationExampleModule } from '@applicationExample/application.example.module';

@Module({
  imports: [
    HealthCheckModule,
    LoggerModule,
    CommonModule,
    ApplicationExampleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const tenantIdHeaderValidator = new HeadersValidator<TenantHeaderInputDto>(
      TenantHeaderInputDto,
    );

    consumer
      .apply(tenantIdHeaderValidator.use.bind(tenantIdHeaderValidator))
      .exclude({
        method: RequestMethod.GET,
        path: '/healthCheck',
      })
      .forRoutes('*');
  }
}
