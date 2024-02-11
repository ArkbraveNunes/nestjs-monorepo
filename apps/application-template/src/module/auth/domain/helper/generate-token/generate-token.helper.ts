import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  GenerateAccessTokenInputDto,
  GenerateRefreshTokenInputDto,
  ValidateTokenInputDto,
  ValidateTokenOutputDto,
} from '@auth/domain/helper';

@Injectable()
export class GenerateTokenHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken({
    id,
  }: GenerateAccessTokenInputDto): Promise<string> {
    return this.jwtService.sign(
      { sub: id },
      {
        secret: this.configService.get('accessTokenSecret'),
        expiresIn: `${this.configService.get('accessTokenTime')}s`,
      },
    );
  }

  async generateRefreshToken({
    id,
  }: GenerateRefreshTokenInputDto): Promise<string> {
    return this.jwtService.sign(
      { sub: id },
      {
        secret: this.configService.get('refreshTokenSecret'),
        expiresIn: `${this.configService.get('refreshTokenTime')}s`,
      },
    );
  }

  async validateToken({
    token,
    secretKey,
  }: ValidateTokenInputDto): Promise<ValidateTokenOutputDto> {
    return this.jwtService.verify(token, {
      ignoreExpiration: false,
      secret: secretKey,
    });
  }
}
