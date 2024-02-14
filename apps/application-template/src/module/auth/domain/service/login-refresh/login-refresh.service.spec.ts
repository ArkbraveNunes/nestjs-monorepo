import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MockProxy, mock } from 'jest-mock-extended';

import {
  LoginRefreshService,
  LoginRefreshServiceInputDto,
} from '@auth/domain/service';
import { MomentService } from '@libs/moment';
import { mockedUserEntity } from '@test/mock';
import { MESSAGES_ERRORS } from '@common/enum';
import { GenerateTokenHelper } from '@auth/domain/helper';
import { UserRepositoryContract } from '@user/domain/contract';

describe('LoginRefreshService', () => {
  let service: LoginRefreshService;
  let generateTokenHelper: MockProxy<GenerateTokenHelper>;
  let mockedUserRepository: MockProxy<UserRepositoryContract>;
  let configService: MockProxy<ConfigService>;
  let momentService: MockProxy<MomentService>;

  const refreshLoginServiceInputDto: LoginRefreshServiceInputDto = {
    refreshToken: faker.string.uuid(),
  };

  beforeEach(() => {
    configService = mock();
    configService.get.mockReturnValueOnce(faker.string.uuid());
    configService.get.mockReturnValueOnce(faker.number.int({ max: 50 }));

    mockedUserRepository = mock();
    mockedUserRepository.findById.mockResolvedValue(mockedUserEntity);

    momentService = mock();
    momentService.addTime.mockReturnValue(moment(new Date()).toISOString());

    generateTokenHelper = mock();
    generateTokenHelper.validateToken.mockResolvedValue({
      sub: mockedUserEntity.id,
      exp: faker.number.int(),
      iat: faker.number.int(),
    });
    generateTokenHelper.generateAccessToken.mockResolvedValue(
      faker.string.uuid(),
    );
    generateTokenHelper.generateRefreshToken.mockResolvedValue(
      faker.string.uuid(),
    );

    service = new LoginRefreshService(
      mockedUserRepository,
      generateTokenHelper,
      momentService,
      configService,
    );
  });

  it('status 200 - success', async () => {
    await service.execute(refreshLoginServiceInputDto);

    expect(generateTokenHelper.validateToken).toHaveBeenCalledTimes(1);
    expect(generateTokenHelper.generateAccessToken).toHaveBeenCalledTimes(1);
    expect(generateTokenHelper.generateAccessToken).toHaveBeenCalledWith({
      id: mockedUserEntity.id,
    });
    expect(generateTokenHelper.generateRefreshToken).toHaveBeenCalledTimes(1);
    expect(generateTokenHelper.generateRefreshToken).toHaveBeenCalledWith({
      id: mockedUserEntity.id,
    });
    expect(configService.get).toHaveBeenCalledTimes(2);
  });

  it('status 401 - validateToken - unauthorized error', async () => {
    generateTokenHelper.validateToken.mockImplementation(() => {
      throw new UnauthorizedException();
    });

    await service
      .execute(refreshLoginServiceInputDto)
      .catch((actualError) => {
        expect(generateTokenHelper.validateToken).toHaveBeenCalledTimes(1);
        expect(actualError instanceof UnauthorizedException).toBe(true);
      })
      .then((result) => expect(result).toBe(undefined));
  });

  it('status 500 - database - internal server error', async () => {
    mockedUserRepository.findById.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute(refreshLoginServiceInputDto)
      .catch((actualError) => {
        expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
