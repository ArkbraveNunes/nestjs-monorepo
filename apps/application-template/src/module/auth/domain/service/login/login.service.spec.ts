import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MockProxy, mock } from 'jest-mock-extended';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginService } from './login.service';
import { LoginServiceInputDto } from './login.service.dto';
import { GenerateTokenHelper } from '@auth/domain/helper';
import { UserRepositoryContract } from '@user/domain/contract';
import moment from 'moment';
import { MomentService } from '@libs/moment';
import { mockedUserEntity } from '@test/mock';
import { CryptographDataService } from '@libs/cryptograph-data';
import { MESSAGES_ERRORS } from '@common/enum';

describe('LoginService', () => {
  let service: LoginService;
  let userRepository: MockProxy<UserRepositoryContract>;
  let cryptographDataService: MockProxy<CryptographDataService>;
  let generateTokenHelper: MockProxy<GenerateTokenHelper>;
  let momentService: MockProxy<MomentService>;
  let configService: MockProxy<ConfigService>;

  let generateTokenInputDto: LoginServiceInputDto;

  beforeEach(() => {
    generateTokenInputDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    userRepository = mock();
    userRepository.findByEmail.mockResolvedValue(mockedUserEntity);

    cryptographDataService = mock();
    cryptographDataService.compareData.mockResolvedValue(true);

    generateTokenHelper = mock();
    generateTokenHelper.generateAccessToken.mockResolvedValue(
      faker.string.uuid(),
    );
    generateTokenHelper.generateRefreshToken.mockResolvedValue(
      faker.string.uuid(),
    );
    momentService = mock();
    momentService.addTime.mockReturnValue(moment(new Date()).toISOString());

    configService = mock();
    configService.get.mockReturnValueOnce(faker.string.uuid());
    configService.get.mockReturnValueOnce(faker.number.int({ max: 50 }));

    service = new LoginService(
      userRepository,
      cryptographDataService,
      generateTokenHelper,
      momentService,
      configService,
    );
  });

  it('status 200 - success', async () => {
    await service.execute(generateTokenInputDto);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(generateTokenHelper.generateAccessToken).toHaveBeenCalledTimes(1);
    expect(generateTokenHelper.generateAccessToken).toHaveBeenCalledWith({
      id: mockedUserEntity.id,
    });
    expect(generateTokenHelper.generateRefreshToken).toHaveBeenCalledWith({
      id: mockedUserEntity.id,
    });
    expect(generateTokenHelper.generateRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('status 401 - compareData - unauthorized error', async () => {
    cryptographDataService.compareData.mockResolvedValue(false);

    await service
      .execute(generateTokenInputDto)
      .catch((actualError) => {
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(UnauthorizedException);
      })
      .then((result) => expect(result).toBe(undefined));
  });

  it('status 401 - findByEmail - unauthorized error', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await service
      .execute(generateTokenInputDto)
      .catch((actualError) => {
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(UnauthorizedException);
      })
      .then((result) => expect(result).toBe(undefined));
  });

  it('status 500 - database - internal server error', async () => {
    userRepository.findByEmail.mockRejectedValue(
      new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
    );

    await service
      .execute(generateTokenInputDto)
      .catch((actualError) => {
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(InternalServerErrorException);
      })
      .then((result) => expect(result).toBe(undefined));
  });
});
