import { UserEntity } from '@user/domain/entity';

export type GenerateAccessTokenInputDto = Pick<UserEntity, 'id'>;

export type GenerateRefreshTokenInputDto = Pick<UserEntity, 'id'>;

export type ValidateTokenInputDto = {
  token: string;
  secretKey: string;
};

export type ValidateTokenOutputDto = {
  sub: string;
  iat: number;
  exp: number;
};
