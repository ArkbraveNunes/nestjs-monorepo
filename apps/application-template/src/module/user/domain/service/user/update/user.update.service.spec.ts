import { ClsService } from 'nestjs-cls';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MockProxy, mock } from 'jest-mock-extended';
import { InternalServerErrorException } from '@nestjs/common';

import { mockedUserEntity } from '@test/mock';
import { UserUpdateService } from './user.update.service';
import { USER_MESSAGES_ERRORS, USER_GENDER } from '@common/enum';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { UserUpdateServiceInputDto } from './user.update.service.dto';

describe('UserUpdateService', () => {
  let service: UserUpdateService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let requestContextService: MockProxy<ClsService<RequestContextInterface>>;

  const updateCustomerServiceInputDto: UserUpdateServiceInputDto = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    gender: USER_GENDER.WOMAN,
  };

  beforeEach(() => {
    userRepository = mock();
    userRepository.updateUserProfile.mockResolvedValue(
      mockedUserEntity.profile,
    );

    requestContextService = mock();
    requestContextService.get.mockReturnValue(
      faker.database.mongodbObjectId().toString(),
    );

    service = new UserUpdateService(userRepository, requestContextService);
  });

  it('status 200 - success', async () => {
    await service.execute(updateCustomerServiceInputDto);

    expect(requestContextService.get).toHaveBeenCalledTimes(1);
    expect(userRepository.updateUserProfile).toHaveBeenCalledTimes(1);
  });

  it('error status 500 - database - internal server error', async () => {
    userRepository.updateUserProfile.mockRejectedValue(
      new InternalServerErrorException(
        USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
      ),
    );

    await service
      .execute(updateCustomerServiceInputDto)
      .catch((actualError) => {
        expect(requestContextService.get).toHaveBeenCalledTimes(1);
        expect(userRepository.updateUserProfile).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((resp) => expect(resp).toBeUndefined());
  });
});
