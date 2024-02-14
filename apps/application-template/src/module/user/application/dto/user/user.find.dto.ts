import { Type } from 'class-transformer';
import { cpf } from 'cpf-cnpj-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { UserFindServiceOutputDto } from '@user/domain/service';
import { MESSAGES_ERRORS, USER_GENDER } from '@common/enum';
import { BadRequestErrorOutputDto } from '@libs/common-dto';

class ProfileOutputDto {
  @ApiProperty({ example: faker.person.fullName() })
  name: string;

  @ApiProperty({ example: faker.internet.email() })
  email: string;

  @ApiProperty({ example: cpf.generate(false) })
  cpf: string;

  @ApiProperty({ example: USER_GENDER.NO_RESPONSE })
  gender: USER_GENDER;

  @ApiProperty({ example: faker.date.birthdate() })
  birthDate: Date;

  @ApiProperty({
    example: `+${faker.helpers.fromRegExp(/55[1-9]{2}9[1-9]{8}/)}`,
  })
  phoneNumber: string;

  @ApiProperty({ example: faker.internet.password() })
  password: string;
}

class CoordinatesOutputDto {
  @ApiProperty({ example: faker.location.latitude() })
  latitude: string;

  @ApiProperty({ example: faker.location.longitude() })
  longitude: string;
}

class AddressOutputDto {
  @ApiProperty({ example: faker.location.street() })
  street?: string;

  @ApiProperty({ example: faker.location.buildingNumber() })
  number: string;

  @ApiProperty({ example: faker.location.secondaryAddress() })
  complement: string;

  @ApiProperty({ example: faker.location.county() })
  district: string;

  @ApiProperty({ example: faker.location.city() })
  city: string;

  @ApiProperty({
    example: faker.string.alpha({ length: 2, casing: 'upper' }),
  })
  state: string;

  @ApiProperty({ example: faker.location.country() })
  country: string;

  @ApiProperty({ example: faker.location.zipCode() })
  zipCode: string;

  @ApiProperty()
  @Type(() => CoordinatesOutputDto)
  coordinates: CoordinatesOutputDto;
}

export class UserFindOutputDto {
  @ApiProperty({ example: faker.database.mongodbObjectId() })
  @IsString()
  id: string;

  @ApiProperty({ type: () => ProfileOutputDto })
  @Type(() => ProfileOutputDto)
  profile: ProfileOutputDto;

  @ApiProperty({ type: () => AddressOutputDto, isArray: true })
  @Type(() => AddressOutputDto)
  address: AddressOutputDto[];

  constructor({ id, profile, address }: UserFindServiceOutputDto) {
    Object.assign(this, {
      id,
      profile: { ...profile, password: undefined },
      address: address.map(({ id: addressId, ...addressItem }) => ({
        addressId,
        ...addressItem,
        createdAt: undefined,
        updatedAt: undefined,
      })),
    });
  }
}

export class UserFindBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
    ],
  })
  message: MESSAGES_ERRORS[];
}
