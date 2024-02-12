import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { MESSAGES_ERRORS } from '@common/enum';
import { BadRequestErrorOutputDto } from '@libs/common-dto';

class CoordinatesDto {
  @ApiProperty({ example: faker.location.latitude() })
  @IsDefined({
    message: MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_REQUIRED,
  })
  @IsString({
    message: MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_INVALID,
  })
  latitude: string;

  @ApiProperty({ example: faker.location.longitude() })
  @IsDefined({
    message: MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_REQUIRED,
  })
  @IsString({
    message: MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_INVALID,
  })
  longitude: string;
}

export class AddressCreateInputDto {
  @ApiPropertyOptional({ example: faker.location.street() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID })
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: faker.location.buildingNumber() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID })
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ example: faker.location.secondaryAddress() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID })
  @IsOptional()
  complement?: string;

  @ApiPropertyOptional({ example: faker.location.county() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID })
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ example: faker.location.city() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID })
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    example: faker.string.alpha({ length: 2, casing: 'upper' }),
  })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID })
  @MaxLength(50, { message: MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID })
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: faker.location.country() })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID })
  @IsOptional()
  country?: string;

  @ApiProperty({ example: faker.location.zipCode() })
  @IsDefined({ message: MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_REQUIRED })
  @IsString({ message: MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID })
  zipCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({
    message: MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
  })
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

export class AddressCreateBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_ALIAS_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_STREET_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_STREET_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_NUMBER_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_NUMBER_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COMPLEMENT_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_DISTRICT_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_CITY_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_CITY_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_STATE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_STATE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COUNTRY_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_ZIP_CODE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LATITUDE_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_COORDINATES_LONGITUDE_IS_INVALID,
    ],
  })
  message: MESSAGES_ERRORS[];
}
