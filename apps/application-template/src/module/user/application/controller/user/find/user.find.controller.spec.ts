import { MockProxy, mock } from 'jest-mock-extended';
import { InternalServerErrorException } from '@nestjs/common';

import { mockedUserEntity } from '@test/mock';
import { USER_MESSAGES_ERRORS } from '@common/enum';
import { UserFindService } from '@user/domain/service';
import { UserFindController } from '@user/application/controller';

describe('UserFindController', () => {
  let controller: UserFindController;
  let mockedUserFindService: MockProxy<UserFindService>;

  beforeEach(() => {
    mockedUserFindService = mock();
    mockedUserFindService.execute.mockResolvedValue(mockedUserEntity);
  });

  beforeEach(() => {
    controller = new UserFindController(mockedUserFindService);
  });

  describe('userFind', () => {
    it('should call UserFindService - success', async () => {
      await controller.userFind();

      expect(mockedUserFindService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call UserUpdateService - error', async () => {
      mockedUserFindService.execute.mockRejectedValue(
        new InternalServerErrorException(
          USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
        ),
      );

      await controller.userFind().catch((actualError) => {
        expect(mockedUserFindService.execute).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      });
    });
  });
});
