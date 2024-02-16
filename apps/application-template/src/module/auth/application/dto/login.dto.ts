import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

import {
  BadRequestErrorOutputDto,
  UnauthorizedErrorOutputDto,
} from '@libs/common-dto';
import { USER_MESSAGES_ERRORS } from '@common/enum';
import { PasswordValidator } from '@libs/validator';
import { LoginServiceOutputDto } from '@auth/domain/service';

export class LoginInputDto {
  @ApiProperty({ example: faker.internet.email() })
  @IsDefined({ message: USER_MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: USER_MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsDefined({ message: USER_MESSAGES_ERRORS.PASSWORD_IS_REQUIRED })
  @PasswordValidator({ message: USER_MESSAGES_ERRORS.PASSWORD_IS_INVALID })
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
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.EMAIL_IS_INVALID,
      USER_MESSAGES_ERRORS.EMAIL_IS_REQUIRED,
      USER_MESSAGES_ERRORS.PASSWORD_IS_REQUIRED,
      USER_MESSAGES_ERRORS.PASSWORD_IS_INVALID,
    ],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_ERRORS[];
}

export class LoginUnauthorizedOutputDto extends UnauthorizedErrorOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_ERRORS.INVALID_EMAIL_OR_PASSWORD],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_ERRORS[];
}
