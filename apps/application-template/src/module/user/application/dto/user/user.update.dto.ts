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
import {
  USER_MESSAGES_ERRORS,
  USER_MESSAGES_SUCCESS,
  USER_GENDER,
} from '@common/enum';
import { UserUpdateServiceOutputDto } from '@user/domain/service';

export class UserUpdateInputDto {
  @ApiProperty({ example: faker.person.fullName() })
  @ValidateIf((body) => !!body.name)
  @IsDefined({ message: USER_MESSAGES_ERRORS.NAME_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.NAME_IS_INVALID })
  name?: string;

  @ApiProperty({ example: faker.internet.email() })
  @ValidateIf((body) => !!body.email)
  @IsDefined({ message: USER_MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: USER_MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email?: string;

  @ApiProperty({
    example: `+${faker.helpers.fromRegExp(/55[1-9]{2}9[1-9]{8}/)}`,
  })
  @ValidateIf((body) => !!body.phoneNumber)
  @IsDefined({ message: USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED })
  @IsMobilePhone(
    undefined,
    { strictMode: true },
    {
      message: USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
    },
  )
  phoneNumber?: string;

  @ApiProperty({ example: USER_GENDER.NON_BINARY })
  @ValidateIf((body) => !!body.gender)
  @IsEnum(USER_GENDER, { message: USER_MESSAGES_ERRORS.GENDER_IS_INVALID })
  gender?: USER_GENDER;
}

export class UserUpdateOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_SUCCESS.USER_UPDATED_WITH_SUCCESS],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_ERRORS[];

  constructor(userUpdateServiceOutputDto: UserUpdateServiceOutputDto) {
    Object.assign(this, userUpdateServiceOutputDto);
  }
}

export class UserUpdateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.NAME_IS_INVALID,
      USER_MESSAGES_ERRORS.EMAIL_IS_INVALID,
      USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
      USER_MESSAGES_ERRORS.GENDER_IS_INVALID,
    ],
  })
  message: USER_MESSAGES_ERRORS[];
}
