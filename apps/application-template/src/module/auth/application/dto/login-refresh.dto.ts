import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsJWT, IsNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker/locale/pt_BR';

import {
  BadRequestErrorOutputDto,
  UnauthorizedErrorOutputDto,
} from '@libs/common-dto';
import { mockedJwtToken } from '@test/mock';
import { USER_MESSAGES_ERRORS } from '@common/enum';
import { LoginRefreshServiceOutputDto } from '@auth/domain/service';

export class LoginRefreshInputDto {
  @ApiProperty({ example: mockedJwtToken })
  @IsDefined({ message: USER_MESSAGES_ERRORS.REFRESH_TOKEN_IS_REQUIRED })
  @IsJWT({ message: USER_MESSAGES_ERRORS.REFRESH_TOKEN_IS_INVALID })
  refreshToken: string;
}

export class LoginRefreshOutputDto {
  @ApiProperty({ example: mockedJwtToken })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ example: mockedJwtToken })
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: faker.number.int({ min: 1000, max: 10000 }) })
  @IsNotEmpty()
  expiresIn: string;

  constructor(loginRefreshServiceOutputDto: LoginRefreshServiceOutputDto) {
    Object.assign(this, loginRefreshServiceOutputDto);
  }
}

export class LoginRefreshBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.REFRESH_TOKEN_IS_INVALID,
      USER_MESSAGES_ERRORS.REFRESH_TOKEN_IS_REQUIRED,
    ],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_ERRORS[];
}

export class LoginRefreshUnauthorizedOutputDto extends UnauthorizedErrorOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_ERRORS.REFRESH_TOKEN_IS_INVALID],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_ERRORS[];
}
