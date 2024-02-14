import { faker } from '@faker-js/faker/locale/pt_BR';
import { MockProxy, mock } from 'jest-mock-extended';

import {
  LoginService,
  LoginServiceOutputDto,
} from '@auth/domain/service/login';
import { LoginInputDto, LoginOutputDto } from '@auth/application/dto';
import { LoginController } from './login.controller';
import { InternalServerErrorException } from '@nestjs/common';
import { MESSAGES_ERRORS } from '@common/enum';

describe('LoginController', () => {
  let controller: LoginController;
  let mockedLoginService: MockProxy<LoginService>;

  const mockedLoginInputDto: LoginInputDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const mockLoginService: LoginServiceOutputDto = {
    accessToken: faker.database.mongodbObjectId(),
    refreshToken: faker.database.mongodbObjectId(),
    expiresIn: faker.date.future().toISOString(),
  };

  beforeEach(() => {
    mockedLoginService = mock();
    mockedLoginService.execute.mockResolvedValue(mockLoginService);

    controller = new LoginController(mockedLoginService);
  });

  describe('login', () => {
    it('should call LoginService - success', async () => {
      await controller.login(mockedLoginInputDto).then((result) => {
        expect(mockedLoginService.execute).toHaveBeenCalledTimes(1);
        Object.keys(new LoginOutputDto(mockLoginService)).forEach((key) =>
          expect(result).toHaveProperty(key),
        );
      });
    });

    it('should call LoginService - error', async () => {
      mockedLoginService.execute.mockRejectedValue(
        new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
      );

      await controller.login(mockedLoginInputDto).catch((actualError) => {
        expect(mockedLoginService.execute).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      });
    });
  });
});
