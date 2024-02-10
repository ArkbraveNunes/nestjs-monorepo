import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { InternalServerErrorException } from '@nestjs/common';

import { MESSAGES_ERRORS, MESSAGES_SUCCESS } from '@common/enum';
import { mockedUserEntity, mockedAddressEntity } from '@test/mock';
import { UserCreateService } from '@applicationExample/domain/service';
import { UserCreateInputDto } from '@applicationExample/application/dto';
import { UserCreateController } from '@applicationExample/application/controller';

describe('UserCreateController', () => {
  let controller: UserCreateController;
  let mockedUserCreateService: MockProxy<UserCreateService>;

  const userCreateInputDto: UserCreateInputDto = {
    ...mockedUserEntity.profile,
    address: mockedAddressEntity(),
  };

  beforeEach(() => {
    mockedUserCreateService = mock();
    mockedUserCreateService.execute.mockResolvedValue({
      id: faker.string.uuid(),
      message: [MESSAGES_SUCCESS.USER_CREATED_WITH_SUCCESS],
    });
  });

  beforeEach(() => {
    controller = new UserCreateController(mockedUserCreateService);
  });

  describe('create', () => {
    it('should call UserCreateService - success', async () => {
      await controller.create(userCreateInputDto);

      expect(mockedUserCreateService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call UserCreateService - error', async () => {
      mockedUserCreateService.execute.mockRejectedValue(
        new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
      );

      await controller.create(userCreateInputDto).catch((actualError) => {
        expect(mockedUserCreateService.execute).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      });
    });
  });
});
