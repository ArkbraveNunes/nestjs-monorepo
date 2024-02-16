import { HISTORY_ACTION, HISTORY_TYPE } from '@common/enum';
import { HistoryEntity } from '@history/domain/entity';
import { mockedUserEntity } from '@test/mock';

const user = {
  _id: mockedUserEntity.id,
  data: {
    profile: mockedUserEntity.profile,
    address: [
      {
        _id: mockedUserEntity.address[0].id,
        ...mockedUserEntity.address[0],
      },
    ],
  },
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockedHistoryEntity = HistoryEntity.create({
  userId: mockedUserEntity.id,
  action: HISTORY_ACTION.CREATE,
  user,
  fieldUpdated: {
    type: HISTORY_TYPE.USER,
    oldValue: null,
    newValue: user,
    modifiedFields: [],
  },
});
