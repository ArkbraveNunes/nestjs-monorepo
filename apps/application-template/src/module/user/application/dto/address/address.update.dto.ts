import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { CoordinatesDto } from '@user/application/dto';
import { USER_MESSAGES_ERRORS, USER_MESSAGES_SUCCESS } from '@common/enum';
import { BadRequestErrorOutputDto } from '@libs/common-dto';
import { AddressUpdateServiceOutput } from '@user/domain/service';

export class AddressUpdateParamIdDto {
  @ApiProperty({ example: faker.database.mongodbObjectId() })
  @IsNotEmpty()
  @IsMongoId({
    message: USER_MESSAGES_ERRORS.ADDRESS_ID_IS_INVALID,
  })
  addressId: string;
}

export class AddressUpdateInputDto {
  @ApiProperty({ example: faker.location.street() })
  @ValidateIf((body) => !!body.street)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_STREET_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID })
  street?: string;

  @ApiProperty({ example: faker.location.buildingNumber() })
  @ValidateIf((body) => !!body.number)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_NUMBER_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID })
  number?: string;

  @ApiProperty({ example: faker.location.secondaryAddress() })
  @ValidateIf((body) => !!body.complement)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID })
  complement?: string;

  @ApiProperty({ example: faker.location.county() })
  @ValidateIf((body) => !!body.district)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID })
  district?: string;

  @ApiProperty({ example: faker.location.city() })
  @ValidateIf((body) => !!body.city)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_CITY_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID })
  city?: string;

  @ApiProperty({
    example: faker.string.alpha({ length: 2, casing: 'upper' }),
  })
  @ValidateIf((body) => !!body.state)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID })
  @MaxLength(50, { message: USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID })
  state?: string;

  @ApiProperty({ example: faker.location.country() })
  @ValidateIf((body) => !!body.country)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID })
  country?: string;

  @ApiProperty({ example: faker.location.zipCode() })
  @ValidateIf((body) => !!body.zipCode)
  @IsDefined({ message: USER_MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_REQUIRED })
  @IsString({ message: USER_MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID })
  zipCode?: string;

  @ApiProperty()
  @ValidateIf((body) => !!body.coordinates)
  @ValidateNested({
    message: USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
  })
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

export class AddressUpdateOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_SUCCESS.ADDRESS_UPDATED_WITH_SUCCESS],
  })
  @IsNotEmpty()
  message: USER_MESSAGES_SUCCESS[];

  constructor(addressUpdateServiceOutputDto: AddressUpdateServiceOutput) {
    Object.assign(this, addressUpdateServiceOutputDto);
  }
}

export class AddressUpdateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_ID_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_ID_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_REQUIRED,
    ],
  })
  message: USER_MESSAGES_ERRORS[];
}
