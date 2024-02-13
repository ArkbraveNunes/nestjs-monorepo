import { faker } from '@faker-js/faker/locale/pt_BR';

import { mockedUserEntity } from '@test/mock';
import { MongoHelper } from './mongo.helper';

describe('MongoHelper', () => {
  const service = MongoHelper;

  it('should call formatSimpleQuery - success - return object query', async () => {
    const baseKey = faker.string.uuid();

    const actualQuery = service.formatSimpleQuery({
      baseKey,
      iterationObject: mockedUserEntity,
    });

    Object.keys(actualQuery).forEach((property) => {
      expect(property.includes(baseKey)).toBeTruthy();
    });
  });
});
