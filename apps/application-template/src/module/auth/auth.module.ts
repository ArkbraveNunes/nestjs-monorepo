import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '@user/user.module';
import {
  LoginController,
  LoginRefreshController,
} from '@auth/application/controller';
import { LoginRefreshService, LoginService } from '@auth/domain/service';
import { GenerateTokenHelper } from '@auth/domain/helper';
import {
  AuthJwtStrategyAdapter,
  AuthJwtPassportAdapter,
} from '@auth/infra/adapter';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LoginController, LoginRefreshController],
  providers: [
    LoginService,
    LoginRefreshService,
    GenerateTokenHelper,
    AuthJwtStrategyAdapter,
    AuthJwtPassportAdapter,
  ],
  exports: [
    JwtModule,
    LoginService,
    PassportModule,
    GenerateTokenHelper,
    LoginRefreshService,
    AuthJwtStrategyAdapter,
    AuthJwtPassportAdapter,
  ],
})
export class AuthModule {}
