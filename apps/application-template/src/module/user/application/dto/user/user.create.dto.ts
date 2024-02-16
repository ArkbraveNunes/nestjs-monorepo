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

import {
  USER_MESSAGES_ERRORS,
  USER_MESSAGES_SUCCESS,
  USER_GENDER,
} from '@common/enum';
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
  @IsDefined({ message: USER_MESSAGES_ERRORS.NAME_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.NAME_IS_INVALID })
  name: string;

  @ApiProperty({ example: faker.internet.email() })
  @IsDefined({ message: USER_MESSAGES_ERRORS.EMAIL_IS_REQUIRED })
  @IsEmail(undefined, { message: USER_MESSAGES_ERRORS.EMAIL_IS_INVALID })
  email: string;

  @ApiProperty({ example: cpf.generate(false) })
  @IsDefined({ message: USER_MESSAGES_ERRORS.CPF_IS_REQUIRED })
  @CPFValidator({
    message: USER_MESSAGES_ERRORS.CPF_IS_INVALID,
  })
  cpf: string;

  @ApiProperty({ example: USER_GENDER.NO_RESPONSE })
  @IsDefined({ message: USER_MESSAGES_ERRORS.GENDER_IS_REQUIRED })
  @IsEnum(USER_GENDER, { message: USER_MESSAGES_ERRORS.GENDER_IS_INVALID })
  gender: USER_GENDER;

  @ApiProperty({ example: faker.date.birthdate() })
  @IsDefined({ message: USER_MESSAGES_ERRORS.BIRTH_DATE_IS_REQUIRED })
  @IsDateString(undefined, {
    message: USER_MESSAGES_ERRORS.BIRTH_DATE_IS_INVALID,
  })
  birthDate: Date;

  @ApiProperty({
    example: `+${faker.helpers.fromRegExp(/55[1-9]{2}9[1-9]{8}/)}`,
  })
  @IsDefined({ message: USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED })
  @IsMobilePhone(
    undefined,
    { strictMode: true },
    {
      message: USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
    },
  )
  phoneNumber: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsDefined({ message: USER_MESSAGES_ERRORS.PASSWORD_IS_REQUIRED })
  @PasswordValidator({
    message: USER_MESSAGES_ERRORS.PASSWORD_IS_INVALID,
  })
  password: string;

  @ApiProperty({ type: () => AddressCreateInputDto })
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_IS_REQUIRED })
  @ValidateNested({
    each: true,
    message: USER_MESSAGES_ERRORS.ADDRESS_IS_INVALID,
  })
  @Type(() => AddressCreateInputDto)
  address: AddressCreateInputDto;
}

export class UserCreateOutputDto {
  @ApiProperty({ example: faker.database.mongodbObjectId() })
  @IsString()
  id: string;

  @ApiProperty({ example: [USER_MESSAGES_SUCCESS.USER_CREATED_WITH_SUCCESS] })
  message: USER_MESSAGES_SUCCESS[];

  constructor(userCreateServiceOutput: UserCreateServiceOutputDto) {
    Object.assign(this, userCreateServiceOutput);
  }
}

export class UserCreateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.NAME_IS_REQUIRED,
      USER_MESSAGES_ERRORS.NAME_IS_INVALID,
      USER_MESSAGES_ERRORS.EMAIL_IS_REQUIRED,
      USER_MESSAGES_ERRORS.EMAIL_IS_INVALID,
      USER_MESSAGES_ERRORS.EMAIL_IS_INVALID_OR_NOT_EXIST,
      USER_MESSAGES_ERRORS.CPF_IS_INVALID,
      USER_MESSAGES_ERRORS.CPF_IS_REQUIRED,
      USER_MESSAGES_ERRORS.BIRTH_DATE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.BIRTH_DATE_IS_INVALID,
      USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_REQUIRED,
      USER_MESSAGES_ERRORS.PHONE_NUMBER_IS_INVALID,
      USER_MESSAGES_ERRORS.PASSWORD_IS_REQUIRED,
      USER_MESSAGES_ERRORS.PASSWORD_IS_INVALID,
      USER_MESSAGES_ERRORS.GENDER_IS_INVALID,
      USER_MESSAGES_ERRORS.GENDER_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_CITY_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_INVALID,
    ],
  })
  message: USER_MESSAGES_ERRORS[];
}

export class UserCreateConflictOutputDto extends ConflictErrorOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_ERRORS.USER_CONFLICT],
  })
  message: USER_MESSAGES_ERRORS[];
}
