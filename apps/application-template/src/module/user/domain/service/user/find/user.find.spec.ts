import { ClsService } from 'nestjs-cls';
import { MockProxy, mock } from 'jest-mock-extended';
import { InternalServerErrorException } from '@nestjs/common';

import { mockedUserEntity } from '@test/mock';
import { MESSAGES_ERRORS } from '@common/enum';
import { UserFindService } from '@user/domain/service';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';

describe('UserFindService', () => {
  let service: UserFindService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let requestContextService: MockProxy<ClsService<RequestContextInterface>>;

  beforeEach(() => {
    userRepository = mock();
    userRepository.findById.mockResolvedValue(mockedUserEntity);

    requestContextService = mock();
    requestContextService.get.mockReturnValue(mockedUserEntity.id);

    service = new UserFindService(userRepository, requestContextService);
  });

  it('status 200 - success', async () => {
    await service.execute();

    expect(requestContextService.get).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockedUserEntity.id);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('error status 500 - database - internal server error', async () => {
    userRepository.findById.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute()
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((resp) => expect(resp).toBeUndefined());
  });
});
