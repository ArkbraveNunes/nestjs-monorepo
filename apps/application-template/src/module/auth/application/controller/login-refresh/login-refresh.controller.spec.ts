import { faker } from '@faker-js/faker/locale/pt_BR';
import { MockProxy, mock } from 'jest-mock-extended';

import {
  LoginRefreshService,
  LoginRefreshServiceOutputDto,
} from '@auth/domain/service';
import {
  LoginRefreshInputDto,
  LoginRefreshOutputDto,
} from '@auth/application/dto';
import { USER_MESSAGES_ERRORS } from '@common/enum';
import { InternalServerErrorException } from '@nestjs/common';
import { LoginRefreshController } from '@auth/application/controller';

describe('LoginRefreshController', () => {
  let controller: LoginRefreshController;
  let mockedLoginRefreshService: MockProxy<LoginRefreshService>;

  const mockedLoginRefreshInputDto: LoginRefreshInputDto = {
    refreshToken: faker.database.mongodbObjectId(),
  };
  const mockLoginRefreshService: LoginRefreshServiceOutputDto = {
    accessToken: faker.internet.password({ length: 15 }),
    refreshToken: faker.internet.password({ length: 15 }),
    expiresIn: faker.date.future().toISOString(),
  };

  beforeEach(() => {
    mockedLoginRefreshService = mock();
    mockedLoginRefreshService.execute.mockResolvedValue(
      mockLoginRefreshService,
    );

    controller = new LoginRefreshController(mockedLoginRefreshService);
  });

  describe('loginRefresh', () => {
    it('should call LoginRefreshService - success', async () => {
      await controller
        .loginRefresh(mockedLoginRefreshInputDto)
        .then((result) => {
          expect(mockedLoginRefreshService.execute).toHaveBeenCalledTimes(1);
          Object.keys(
            new LoginRefreshOutputDto(mockLoginRefreshService),
          ).forEach((key) => expect(result).toHaveProperty(key));
        });
    });

    it('should call LoginRefreshService - error', async () => {
      mockedLoginRefreshService.execute.mockRejectedValue(
        new InternalServerErrorException(
          USER_MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
        ),
      );

      await controller
        .loginRefresh(mockedLoginRefreshInputDto)
        .catch((actualError) => {
          expect(mockedLoginRefreshService.execute).toHaveBeenCalledTimes(1);
          expect(actualError).toBeInstanceOf(InternalServerErrorException);
        });
    });
  });
});
