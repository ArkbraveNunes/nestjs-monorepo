import { InternalServerErrorException } from '@nestjs/common';
import { MockProxy, mock } from 'jest-mock-extended';

import { mockedHistoryEntity } from '@test/mock';
import {
  HistoryCreateService,
  HistoryCreateServiceInput,
} from '@history/domain/service';
import {
  HISTORY_ACTION,
  HISTORY_MESSAGES_ERRORS,
  HISTORY_TYPE,
} from '@common/enum';
import { HistoryRepository } from '@history/infra/repository';

describe('HistoryCreateService', () => {
  let service: HistoryCreateService;
  let historyRepository: MockProxy<HistoryRepository>;

  const historyCreateServiceInput: HistoryCreateServiceInput = {
    action: HISTORY_ACTION.CREATE,
    user: mockedHistoryEntity.user,
    fieldUpdated: {
      type: HISTORY_TYPE.USER,
      value: {
        ...mockedHistoryEntity.user,
      },
    },
  };

  beforeEach(() => {
    historyRepository = mock();
    historyRepository.findById.mockResolvedValue(mockedHistoryEntity);
    historyRepository.create.mockResolvedValue(void 0);

    service = new HistoryCreateService(historyRepository);
  });

  it('status 200 - Action CREATE and Type CUSTOMER - success', async () => {
    await service.execute(historyCreateServiceInput);

    expect(historyRepository.findById).toHaveBeenCalledTimes(0);
    expect(historyRepository.create).toHaveBeenCalledTimes(1);
  });

  it('status 200 - Action UPDATE and Type ADDRESS - success', async () => {
    const newHistoryCreateServiceInput = {
      user: historyCreateServiceInput.user,
      action: HISTORY_ACTION.UPDATE,
      fieldUpdated: {
        type: HISTORY_TYPE.ADDRESS,
        value: {
          ...historyCreateServiceInput.user.data.address[0],
        },
      },
    };

    await service.execute(newHistoryCreateServiceInput);

    expect(historyRepository.findById).toHaveBeenCalledTimes(1);
    expect(historyRepository.findById).toHaveBeenCalledWith(
      historyCreateServiceInput.user._id.toString(),
    );
    expect(historyRepository.create).toHaveBeenCalledTimes(1);
  });

  it('status 200 - Action DELETE and Type ADDRESS - success', async () => {
    const newHistoryCreateServiceInput = {
      ...historyCreateServiceInput,
      action: HISTORY_ACTION.DELETE,
      fieldUpdated: {
        type: HISTORY_TYPE.ADDRESS,
        value: [historyCreateServiceInput.user.data.address],
      },
    };

    await service.execute(newHistoryCreateServiceInput);

    expect(historyRepository.findById).toHaveBeenCalledTimes(1);
    expect(historyRepository.findById).toHaveBeenCalledWith(
      historyCreateServiceInput.user._id.toString(),
    );
    expect(historyRepository.create).toHaveBeenCalledTimes(1);
  });

  it('error status 500 - database - internal server error', async () => {
    historyRepository.create.mockRejectedValue(
      new InternalServerErrorException(
        HISTORY_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
      ),
    );

    await service
      .execute(historyCreateServiceInput)
      .catch((actualError) => {
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
