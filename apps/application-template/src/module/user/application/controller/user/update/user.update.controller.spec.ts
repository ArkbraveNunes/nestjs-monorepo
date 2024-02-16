import { MockProxy, mock } from 'jest-mock-extended';
import { InternalServerErrorException } from '@nestjs/common';

import { mockedUserEntity } from '@test/mock';
import { UserUpdateService } from '@user/domain/service';
import { UserUpdateInputDto } from '@user/application/dto';
import { USER_MESSAGES_ERRORS, USER_MESSAGES_SUCCESS } from '@common/enum';
import { UserUpdateController } from '@user/application/controller';

describe('UserUpdateController', () => {
  let controller: UserUpdateController;
  let userUpdateCustomerService: MockProxy<UserUpdateService>;

  const userUpdateInputDto: UserUpdateInputDto = {
    ...mockedUserEntity.profile,
  };

  beforeEach(() => {
    userUpdateCustomerService = mock();
    userUpdateCustomerService.execute.mockResolvedValue({
      message: [USER_MESSAGES_SUCCESS.USER_UPDATED_WITH_SUCCESS],
    });
  });

  beforeEach(() => {
    controller = new UserUpdateController(userUpdateCustomerService);
  });

  describe('userUpdate', () => {
    it('should call UserUpdateService - success', async () => {
      await controller.userUpdate(userUpdateInputDto);

      expect(userUpdateCustomerService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call UserUpdateService - error', async () => {
      userUpdateCustomerService.execute.mockRejectedValue(
        new InternalServerErrorException(
          USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
        ),
      );

      await controller.userUpdate(userUpdateInputDto).catch((actualError) => {
        expect(userUpdateCustomerService.execute).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      });
    });
  });
});
