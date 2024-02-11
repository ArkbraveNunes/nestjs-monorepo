import { InternalServerErrorException } from '@nestjs/common';
import { MockProxy, mock } from 'jest-mock-extended';

import { mockedUserEntity, mockedAddressEntity } from '@test/mock';
import {
  UserCreateService,
  UserCreateServiceInputDto,
} from '@user/domain/service';
import { UserRepositoryContract } from '@user/domain/contract';
import { MESSAGES_ERRORS, MESSAGES_SUCCESS } from '@common/enum';
import { CryptographDataService } from '@libs/cryptograph-data';

describe('UserCreateService', () => {
  let service: UserCreateService;
  let customerRepository: MockProxy<UserRepositoryContract>;
  let cryptographDataService: MockProxy<CryptographDataService>;

  const userCreateServiceInputDto: UserCreateServiceInputDto = {
    ...mockedUserEntity.profile,
    address: mockedAddressEntity(),
  };

  beforeEach(() => {
    customerRepository = mock();
    customerRepository.create.mockResolvedValue(void 0);

    cryptographDataService = mock();
    cryptographDataService.encryptData.mockResolvedValue(
      mockedUserEntity.profile.password,
    );

    service = new UserCreateService(customerRepository, cryptographDataService);
  });

  it('status 200 - success', async () => {
    const actualResult = await service.execute(userCreateServiceInputDto);

    expect(cryptographDataService.encryptData).toHaveBeenCalledTimes(1);
    expect(cryptographDataService.encryptData).toHaveBeenCalledWith(
      userCreateServiceInputDto.password,
    );
    expect(customerRepository.create).toHaveBeenCalledTimes(1);
    expect(actualResult.id).toBeDefined();
    expect(
      actualResult.message.includes(MESSAGES_SUCCESS.USER_CREATED_WITH_SUCCESS),
    ).toBe(true);
  });

  it('error status 500 - cryptographDataService - internal server error', async () => {
    cryptographDataService.encryptData.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute(userCreateServiceInputDto)
      .catch((actualError) => {
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });

  it('error status 500 - database - internal server error', async () => {
    customerRepository.create.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute(userCreateServiceInputDto)
      .catch((actualError) => {
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
