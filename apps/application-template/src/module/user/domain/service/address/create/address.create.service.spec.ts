import { InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MockProxy, mock } from 'jest-mock-extended';

import { mockedUserEntity, mockedAddressEntity } from '@test/mock';
import {
  AddressCreateService,
  AddressCreateServiceInputDto,
} from '@user/domain/service';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { USER_MESSAGES_ERRORS } from '@common/enum';

describe('AddressCreateService', () => {
  let service: AddressCreateService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let requestContextService: MockProxy<ClsService<RequestContextInterface>>;

  const addressCreateServiceInputDto: AddressCreateServiceInputDto = {
    ...mockedAddressEntity(),
  };

  beforeEach(() => {
    userRepository = mock();
    userRepository.createAddress.mockResolvedValue([mockedAddressEntity()]);

    requestContextService = mock();
    requestContextService.get.mockReturnValueOnce(mockedUserEntity.id);

    service = new AddressCreateService(userRepository, requestContextService);
  });

  it('status 200 - success', async () => {
    await service.execute({ ...addressCreateServiceInputDto });

    expect(requestContextService.get).toHaveBeenCalledTimes(1);
    expect(userRepository.createAddress).toHaveBeenCalledTimes(1);
  });

  it('error status 500 - database - internal server error', async () => {
    userRepository.createAddress.mockRejectedValue(
      new InternalServerErrorException(
        USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
      ),
    );

    await service
      .execute({ ...addressCreateServiceInputDto })
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
