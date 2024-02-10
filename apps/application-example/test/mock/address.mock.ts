import { faker } from '@faker-js/faker/locale/pt_BR';
import {
  AddressEntity,
  CreateAddressProps,
} from '@applicationExample/domain/entity';

export const mockedAddressEntity = (createAddressProps?: CreateAddressProps) =>
  AddressEntity.create(
    createAddressProps || {
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      complement: faker.location.secondaryAddress(),
      district: faker.location.county(),
      coordinates: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
    },
  );
