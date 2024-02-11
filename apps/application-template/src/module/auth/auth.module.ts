import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '@user/user.module';
import { LoginController } from '@auth/application/controller';
import { LoginService } from '@auth/domain/service';
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
  controllers: [LoginController],
  providers: [
    LoginService,
    GenerateTokenHelper,
    AuthJwtStrategyAdapter,
    AuthJwtPassportAdapter,
  ],
  exports: [
    PassportModule,
    JwtModule,
    LoginService,
    GenerateTokenHelper,
    AuthJwtStrategyAdapter,
    AuthJwtPassportAdapter,
  ],
})
export class AuthModule {}
