import { faker } from '@faker-js/faker/locale/pt_BR';
import { UserEntity } from '@user/domain/entity';
import { USER_GENDER } from '@common/enum';
import { cpf } from 'cpf-cnpj-validator';
import { mockedAddressEntity } from '@test/mock';

export const mockedUserEntity = UserEntity.create({
  profile: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    gender: USER_GENDER.MAN,
    password: faker.internet.password(),
    cpf: cpf.generate(false),
    phoneNumber: faker.phone.number(),
    birthDate: faker.date.birthdate(),
  },
  address: [mockedAddressEntity()],
});
