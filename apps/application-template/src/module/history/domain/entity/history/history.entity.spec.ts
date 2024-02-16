import { HISTORY_ACTION, HISTORY_TYPE } from '@common/enum';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { HistoryEntity } from '@history/domain/entity';

describe('HistoryEntity', () => {
  it('should return a HistoryEntity instance with valid props on create()', () => {
    const history = HistoryEntity.create({
      userId: faker.database.mongodbObjectId(),
      user: {},
      action: HISTORY_ACTION.CREATE,
      fieldUpdated: {
        type: HISTORY_TYPE.USER,
        oldValue: null,
        newValue: {},
        modifiedFields: [],
      },
    });

    expect(history.id).toBeDefined();
    expect(history.user).toBeDefined();
    expect(history.userId).toBeDefined();
    expect(history.action).toBeDefined();
    expect(history.fieldUpdated).toBeDefined();
    expect(history.createdAt).toBeDefined();
  });
});
