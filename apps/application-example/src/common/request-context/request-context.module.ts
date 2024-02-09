import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { REQUEST_CONTEXT } from '@common/enum';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set(
            REQUEST_CONTEXT.TENANT_ID,
            req.headers[REQUEST_CONTEXT.TENANT_ID],
          );
        },
      },
    }),
  ],
})
export class RequestContextModule {}
