import { InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MockProxy, mock } from 'jest-mock-extended';

import { mockedUserEntity, mockedAddressEntity } from '@test/mock';
import {
  AddressUpdateService,
  AddressUpdateServiceInput,
} from '@user/domain/service';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { USER_MESSAGES_ERRORS } from '@common/enum';

describe('AddressUpdateService', () => {
  let service: AddressUpdateService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let requestContextService: MockProxy<ClsService<RequestContextInterface>>;

  const addressUpdateServiceInput: AddressUpdateServiceInput = {
    addressId: mockedAddressEntity().id,
    ...mockedAddressEntity(),
  };

  beforeEach(() => {
    userRepository = mock();
    userRepository.updateAddress.mockResolvedValue(mockedAddressEntity());

    requestContextService = mock();
    requestContextService.get.mockReturnValueOnce(mockedUserEntity.id);

    service = new AddressUpdateService(userRepository, requestContextService);
  });

  it('status 200 - success', async () => {
    await service.execute({ ...addressUpdateServiceInput });

    expect(requestContextService.get).toHaveBeenCalledTimes(1);
    expect(userRepository.updateAddress).toHaveBeenCalledWith(
      mockedUserEntity.id,
      { ...addressUpdateServiceInput },
    );
    expect(userRepository.updateAddress).toHaveBeenCalledTimes(1);
  });

  it('error status 500 - database - internal server error', async () => {
    userRepository.updateAddress.mockRejectedValue(
      new InternalServerErrorException(
        USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
      ),
    );

    await service
      .execute({ ...addressUpdateServiceInput })
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
