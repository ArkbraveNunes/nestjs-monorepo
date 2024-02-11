import { Request } from 'express';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { ClsService } from 'nestjs-cls';
import { MESSAGES_ERRORS, REQUEST_CONTEXT, REPOSITORY } from '@common/enum';

@Injectable()
export class AuthJwtStrategyAdapter extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly configService: ConfigService,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {
    super({
      secretOrKey: configService.get('accessTokenSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    { sub: id }: Record<string, any>,
    done: VerifiedCallback,
  ): Promise<any> {
    await this.userRepository
      .findById(id)
      .then((customer) => {
        this.requestContextService.set(REQUEST_CONTEXT.USER_ID, customer.id);

        return done(null, customer);
      })
      .catch(() => {
        return done(
          new UnauthorizedException(MESSAGES_ERRORS.USER_UNAUTHORIZED),
          false,
        );
      });
  }
}

@Injectable()
export class AuthJwtPassportAdapter extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException(MESSAGES_ERRORS.USER_UNAUTHORIZED);
    }
    return user;
  }
}
