import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { BadRequestErrorOutputDto } from '@libs/common-dto';
import { MESSAGES_ERRORS, MESSAGES_SUCCESS, USER_GENDER } from '@common/enum';

export class UserUpdateInputDto {
  @ApiProperty({ example: faker.person.fullName() })
  @ValidateIf((body) => !!body.name)
  @IsDefined({ message: MESSAGES_ERRORS.NAME_IS_REQUIRED })
  @IsString({ message: MESSAGES_ERRORS.NAME_IS_INVALID })
  name?: string;

  @ApiProperty({ example: faker.internet.email() })
  @ValidateIf((body) => !!body.email)
  @IsDefined({ message: MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email?: string;

  @ApiProperty({
    example: `+${faker.helpers.fromRegExp(/55[1-9]{2}9[1-9]{8}/)}`,
  })
  @ValidateIf((body) => !!body.phoneNumber)
  @IsDefined({ message: MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED })
  @IsMobilePhone(
    undefined,
    { strictMode: true },
    {
      message: MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
    },
  )
  phoneNumber?: string;

  @ApiProperty({ example: USER_GENDER.NON_BINARY })
  @ValidateIf((body) => !!body.gender)
  @IsEnum(USER_GENDER, { message: MESSAGES_ERRORS.GENDER_IS_INVALID })
  gender?: USER_GENDER;
}

export class UserUpdateOutputDto {
  @ApiProperty({
    example: [MESSAGES_SUCCESS.USER_UPDATED_WITH_SUCCESS],
  })
  @IsNotEmpty()
  message: MESSAGES_ERRORS[];

  constructor(userUpdateServiceOutputDto: any) {
    Object.assign(this, userUpdateServiceOutputDto);
  }
}

export class UserUpdateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      MESSAGES_ERRORS.NAME_IS_INVALID,
      MESSAGES_ERRORS.EMAIL_IS_INVALID,
      MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
      MESSAGES_ERRORS.GENDER_IS_INVALID,
    ],
  })
  message: MESSAGES_ERRORS[];
}
