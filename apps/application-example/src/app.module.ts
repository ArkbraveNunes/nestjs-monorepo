import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { HeadersValidator } from '@libs/middleware';
import { LoggerModule } from '@libs/logger';
import { HealthCheckModule } from '@libs/healthcheck';
import { TenantIdHeaderInputDto } from '@libs/common-dto';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [HealthCheckModule, LoggerModule, CommonModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const tenantIdHeaderValidator =
      new HeadersValidator<TenantIdHeaderInputDto>(TenantIdHeaderInputDto);

    consumer
      .apply(tenantIdHeaderValidator.use.bind(tenantIdHeaderValidator))
      .exclude({
        method: RequestMethod.GET,
        path: '/healthCheck',
      })
      .forRoutes('*');
  }
}
