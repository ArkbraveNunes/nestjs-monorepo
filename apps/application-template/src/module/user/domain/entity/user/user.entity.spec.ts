import { faker } from '@faker-js/faker/locale/pt_BR';
import { cpf } from 'cpf-cnpj-validator';

import { UserEntity } from '@user/domain/entity';
import { USER_GENDER } from '@common/enum';

describe('UserEntity', () => {
  it('should return a UserEntity instance with valid props on create()', () => {
    const user = UserEntity.create({
      profile: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        gender: USER_GENDER.MAN,
        password: faker.internet.password(),
        cpf: cpf.generate(false),
        phoneNumber: faker.phone.number(),
        birthDate: faker.date.birthdate(),
      },
      address: [
        {
          zipCode: faker.location.zipCode(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
        },
      ],
    });

    expect(user.id).toBeDefined();
    expect(user.profile).toBeDefined();
    expect(user.address).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.deletedAt).toBeDefined();
  });
});
