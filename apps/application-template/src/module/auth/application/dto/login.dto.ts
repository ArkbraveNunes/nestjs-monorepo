import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

import {
  BadRequestErrorOutputDto,
  UnauthorizedErrorOutputDto,
} from '@libs/common-dto';
import { MESSAGES_ERRORS } from '@common/enum';
import { PasswordValidator } from '@libs/validator';
import { LoginServiceOutputDto } from '@auth/domain/service';

export class LoginInputDto {
  @ApiProperty({ example: faker.internet.email() })
  @IsDefined({ message: MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsDefined({ message: MESSAGES_ERRORS.PASSWORD_IS_REQUIRED })
  @PasswordValidator({ message: MESSAGES_ERRORS.PASSWORD_IS_INVALID })
  password: string;
}

export class LoginOutputDto {
  @ApiProperty({ example: faker.internet.password({ length: 15 }) })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ example: faker.internet.password({ length: 15 }) })
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: faker.number.int({ max: 50 }) })
  @IsNotEmpty()
  expiresIn: string;

  constructor(loginServiceOutputDto: LoginServiceOutputDto) {
    Object.assign(this, loginServiceOutputDto);
  }
}

export class LoginBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      MESSAGES_ERRORS.EMAIL_IS_INVALID,
      MESSAGES_ERRORS.EMAIL_IS_REQUIRED,
      MESSAGES_ERRORS.PASSWORD_IS_REQUIRED,
      MESSAGES_ERRORS.PASSWORD_IS_INVALID,
    ],
  })
  @IsNotEmpty()
  message: MESSAGES_ERRORS[];
}

export class LoginUnauthorizedOutputDto extends UnauthorizedErrorOutputDto {
  @ApiProperty({
    example: [MESSAGES_ERRORS.INVALID_EMAIL_OR_PASSWORD],
  })
  @IsNotEmpty()
  message: MESSAGES_ERRORS[];
}
