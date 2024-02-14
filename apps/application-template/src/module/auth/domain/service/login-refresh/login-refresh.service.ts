import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Service } from '@libs/contract';
import { MomentService, MOMENT_TIMES } from '@libs/moment';
import {
  LoginRefreshServiceInputDto,
  LoginRefreshServiceOutputDto,
} from '@auth/domain/service';
import { GenerateTokenHelper } from '@auth/domain/helper';
import { UserRepositoryContract } from '@user/domain/contract';
import { MESSAGES_ERRORS, REPOSITORY } from '@common/enum';

@Injectable()
export class LoginRefreshService
  implements
    Service<LoginRefreshServiceInputDto, Promise<LoginRefreshServiceOutputDto>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly generateTokenHelper: GenerateTokenHelper,
    private readonly momentService: MomentService,
    private readonly configService: ConfigService,
  ) {}

  async execute({
    refreshToken: refreshTokenFromBody,
  }: LoginRefreshServiceInputDto): Promise<LoginRefreshServiceOutputDto> {
    const { sub: id } = await this.generateTokenHelper
      .validateToken({
        secretKey: this.configService.get('refreshTokenSecret'),
        token: refreshTokenFromBody,
      })
      .catch(() => {
        throw new UnauthorizedException(
          MESSAGES_ERRORS.REFRESH_TOKEN_IS_INVALID,
        );
      });

    const { id: userId } = await this.userRepository.findById(id);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenHelper.generateAccessToken({ id: userId }),
      this.generateTokenHelper.generateRefreshToken({ id: userId }),
    ]);

    const expiresIn = this.momentService.addTime(
      Date.now(),
      MOMENT_TIMES.SECOND,
      this.configService.get('accessTokenTime'),
    );

    return { accessToken, refreshToken, expiresIn };
  }
}
