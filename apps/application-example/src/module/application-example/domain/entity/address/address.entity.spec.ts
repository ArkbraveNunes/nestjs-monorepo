import { faker } from '@faker-js/faker/locale/pt_BR';

import { AddressEntity } from '@applicationExample/domain/entity';

describe('AddressEntity', () => {
  it('should return a AddressEntity instance with valid props on create()', () => {
    const address = AddressEntity.create({
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      complement: faker.location.cardinalDirection(),
      district: faker.location.streetAddress(),
      number: faker.location.buildingNumber(),
      street: faker.location.street(),
      coordinates: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
    });

    expect(address.id).toBeDefined();
    expect(address.zipCode).toBeDefined();
    expect(address.city).toBeDefined();
    expect(address.state).toBeDefined();
    expect(address.country).toBeDefined();
    expect(address.complement).toBeDefined();
    expect(address.district).toBeDefined();
    expect(address.number).toBeDefined();
    expect(address.street).toBeDefined();
    expect(address.coordinates).toBeDefined();
    expect(address.createdAt).toBeDefined();
    expect(address.updatedAt).toBeDefined();
  });
});
