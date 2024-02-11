import { faker } from '@faker-js/faker/locale/pt_BR';
import jwt from 'jsonwebtoken';

export const mockedJwtToken = jwt.sign(
  { sub: faker.database.mongodbObjectId() },
  'secret',
  { expiresIn: 3600 },
);
