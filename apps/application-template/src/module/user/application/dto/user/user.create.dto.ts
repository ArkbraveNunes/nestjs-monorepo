import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  ValidateNested,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ApiProperty } from '@nestjs/swagger';
import { cpf } from 'cpf-cnpj-validator';

import { MESSAGES_ERRORS, MESSAGES_SUCCESS, USER_GENDER } from '@common/enum';
import {
  BadRequestErrorOutputDto,
  ConflictErrorOutputDto,
} from '@libs/common-dto';
import { CPFValidator, PasswordValidator } from '@libs/validator';
import { Type } from 'class-transformer';
import { AddressCreateInputDto } from '@user/application/dto';
import { UserCreateServiceOutputDto } from '@user/domain/service';

export class UserCreateInputDto {
  @ApiProperty({ example: faker.person.fullName() })
  @IsDefined({ message: MESSAGES_ERRORS.NAME_IS_REQUIRED })
  @IsString({ message: MESSAGES_ERRORS.NAME_IS_INVALID })
  name: string;

  @ApiProperty({ example: faker.internet.email() })
  @IsDefined({ message: MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email: string;

  @ApiProperty({ example: cpf.generate(false) })
  @IsDefined({ message: MESSAGES_ERRORS.CPF_IS_REQUIRED })
  @CPFValidator({
    message: MESSAGES_ERRORS.CPF_IS_INVALID,
  })
  cpf: string;

  @ApiProperty({ example: USER_GENDER.NO_RESPONSE })
  @IsDefined({ message: MESSAGES_ERRORS.GENDER_IS_REQUIRED })
  @IsEnum(USER_GENDER, { message: MESSAGES_ERRORS.GENDER_IS_INVALID })
  gender: USER_GENDER;

  @ApiProperty({ example: faker.date.birthdate() })
  @IsDefined({ message: MESSAGES_ERRORS.BIRTH_DATE_IS_REQUIRED })
  @IsDateString(undefined, {
    message: MESSAGES_ERRORS.BIRTH_DATE_IS_INVALID,
  })
  birthDate: Date;

  @ApiProperty({
    example: `+${faker.helpers.fromRegExp(/55[0-9]{2}9[0-9]{8}/)}`,
  })
  @IsDefined({ message: MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED })
  @IsMobilePhone(
    undefined,
    { strictMode: true },
    {
      message: MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
    },
  )
  phoneNumber: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsDefined({ message: MESSAGES_ERRORS.PASSWORD_IS_REQUIRED })
  @PasswordValidator({
    message: MESSAGES_ERRORS.PASSWORD_IS_INVALID,
  })
  password: string;

  @ApiProperty({ type: () => AddressCreateInputDto })
  @IsDefined({ message: MESSAGES_ERRORS.ADDRESS_IS_REQUIRED })
  @ValidateNested({
    each: true,
    message: MESSAGES_ERRORS.ADDRESS_IS_INVALID,
  })
  @Type(() => AddressCreateInputDto)
  address: AddressCreateInputDto;
}

export class UserCreateOutputDto {
  @ApiProperty({ example: faker.database.mongodbObjectId() })
  @IsString()
  id: string;

  @ApiProperty({ example: [MESSAGES_SUCCESS.USER_CREATED_WITH_SUCCESS] })
  message: MESSAGES_SUCCESS[];

  constructor(userCreateServiceOutput: UserCreateServiceOutputDto) {
    Object.assign(this, userCreateServiceOutput);
  }
}

export class UserCreateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      MESSAGES_ERRORS.NAME_IS_REQUIRED,
      MESSAGES_ERRORS.NAME_IS_INVALID,
      MESSAGES_ERRORS.EMAIL_IS_REQUIRED,
      MESSAGES_ERRORS.EMAIL_IS_INVALID,
      MESSAGES_ERRORS.EMAIL_IS_INVALID_OR_NOT_EXIST,
      MESSAGES_ERRORS.CPF_IS_INVALID,
      MESSAGES_ERRORS.CPF_IS_REQUIRED,
      MESSAGES_ERRORS.BIRTH_DATE_IS_REQUIRED,
      MESSAGES_ERRORS.BIRTH_DATE_IS_INVALID,
      MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED,
      MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
      MESSAGES_ERRORS.PASSWORD_IS_REQUIRED,
      MESSAGES_ERRORS.PASSWORD_IS_INVALID,
      MESSAGES_ERRORS.GENDER_IS_INVALID,
      MESSAGES_ERRORS.GENDER_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_CITY_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_STATE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_INVALID,
    ],
  })
  message: MESSAGES_ERRORS[];
}

export class UserCreateConflictOutputDto extends ConflictErrorOutputDto {
  @ApiProperty({
    example: [MESSAGES_ERRORS.USER_CONFLICT],
  })
  message: MESSAGES_ERRORS[];
}
