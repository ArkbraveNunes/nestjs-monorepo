import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Service } from '@libs/contract';
import { MomentService, MOMENT_TIMES } from '@libs/moment';
import {
  LoginServiceInputDto,
  LoginServiceOutputDto,
} from '@auth/domain/service';
import { UserRepositoryContract } from '@user/domain/contract';
import { GenerateTokenHelper } from '@auth/domain/helper';
import { MESSAGES_ERRORS, REPOSITORY } from '@common/enum';
import { CryptographDataService } from '@libs/cryptograph-data';

@Injectable()
export class LoginService
  implements Service<LoginServiceInputDto, Promise<LoginServiceOutputDto>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly cryptographDataService: CryptographDataService,
    private readonly generateTokenHelper: GenerateTokenHelper,
    private readonly momentService: MomentService,
    private readonly configService: ConfigService,
  ) {}

  async execute({
    email,
    password,
  }: LoginServiceInputDto): Promise<LoginServiceOutputDto> {
    const user = await this.userRepository.findByEmail({
      email,
    });

    if (
      !user ||
      !(await this.cryptographDataService.compareData(
        password,
        user.profile.password,
      ))
    ) {
      throw new UnauthorizedException(
        MESSAGES_ERRORS.INVALID_EMAIL_OR_PASSWORD,
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenHelper.generateAccessToken({ id: user.id }),
      this.generateTokenHelper.generateRefreshToken({ id: user.id }),
    ]);

    const expiresIn = this.momentService.addTime(
      Date.now(),
      MOMENT_TIMES.SECOND,
      this.configService.get('accessTokenTime'),
    );

    return { accessToken, refreshToken, expiresIn };
  }
}
