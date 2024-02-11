import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { HeadersValidator } from '@libs/middleware';
import { HealthCheckModule } from '@libs/healthcheck';
import { TenantHeaderInputDto } from '@libs/common-dto';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [HealthCheckModule, CommonModule, UserModule, AuthModule],
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
