import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MockProxy, mock } from 'jest-mock-extended';

import {
  AddressDeleteService,
  AddressDeleteServiceInput,
} from '@user/domain/service';
import { MESSAGES_ERRORS } from '@common/enum';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { mockedAddressEntity, mockedUserEntity } from '@test/mock';

describe('AddressDeleteService', () => {
  let service: AddressDeleteService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let requestContextService: MockProxy<ClsService<RequestContextInterface>>;

  const addressDeleteServiceInput: AddressDeleteServiceInput = {
    addressId: mockedUserEntity.address[0].id,
  };

  beforeEach(() => {
    userRepository = mock();
    userRepository.findById.mockResolvedValue({
      ...mockedUserEntity,
      address: [...mockedUserEntity.address, mockedAddressEntity()],
    });
    userRepository.deleteAddress.mockResolvedValue([mockedAddressEntity()]);

    requestContextService = mock();
    requestContextService.get.mockReturnValueOnce(mockedUserEntity.id);

    service = new AddressDeleteService(userRepository, requestContextService);
  });

  it('status 200 - success', async () => {
    await service.execute({
      ...addressDeleteServiceInput,
    });

    expect(requestContextService.get).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledWith(mockedUserEntity.id);
    expect(userRepository.deleteAddress).toHaveBeenCalledTimes(1);
    expect(userRepository.deleteAddress).toHaveBeenCalledWith(
      mockedUserEntity.id,
      { addressId: mockedUserEntity.address[0].id },
    );
  });

  it('error status 400 - findById - address list is < 2', async () => {
    userRepository.findById.mockResolvedValue({
      ...mockedUserEntity,
      address: [...mockedUserEntity.address],
    });

    await service
      .execute({
        ...addressDeleteServiceInput,
      })
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(BadRequestException);
      })
      .then((result) => expect(result).toBe(undefined));
  });

  it('error status 500 - database - internal server error', async () => {
    userRepository.deleteAddress.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute({
        ...addressDeleteServiceInput,
      })
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(userRepository.findById).toHaveBeenCalledTimes(1);
        expect(userRepository.deleteAddress).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
