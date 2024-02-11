import { faker } from '@faker-js/faker';
import { MockProxy, mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { mockedUserEntity, mockedJwtToken } from '@test/mock';
import { GenerateTokenHelper } from './generate-token.helper';

describe('GenerateTokenHelper', () => {
  let service: GenerateTokenHelper;
  let configService: MockProxy<ConfigService>;
  let jwtService: MockProxy<JwtService>;

  const mockedSignJwtPayload: Record<string, any> = {
    sub: mockedUserEntity.id,
  };

  const mockedSignJwtSignSeconds = faker.number.int();
  const mockedSignJwtSignSecondsWithSuffix = `${mockedSignJwtSignSeconds}s`;
  const mockedSignJwtSignOptions = {
    secret: faker.string.uuid(),
    expiresIn: mockedSignJwtSignSecondsWithSuffix,
  };

  beforeEach(() => {
    configService = mock();

    jwtService = mock();
    jwtService.sign.mockReturnValue(mockedJwtToken);
    jwtService.verify.mockReturnValue({
      sub: mockedUserEntity.id,
    });

    service = new GenerateTokenHelper(configService, jwtService);
  });

  it('generateAccessToken - success - return accessToken', async () => {
    configService.get.mockReturnValueOnce(mockedSignJwtSignOptions.secret);
    configService.get.mockReturnValueOnce(mockedSignJwtSignSeconds);

    await service.generateAccessToken({ id: mockedUserEntity.id });

    expect(jwtService.sign).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledWith(
      mockedSignJwtPayload,
      mockedSignJwtSignOptions,
    );
    expect(configService.get).toHaveBeenCalledTimes(2);
  });

  it('generateAccessToken - success - return refreshToken', async () => {
    configService.get.mockReturnValueOnce(mockedSignJwtSignOptions.secret);
    configService.get.mockReturnValueOnce(mockedSignJwtSignSeconds);

    await service.generateRefreshToken({ id: mockedUserEntity.id });

    expect(jwtService.sign).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledWith(
      mockedSignJwtPayload,
      mockedSignJwtSignOptions,
    );
    expect(configService.get).toHaveBeenCalledTimes(2);
  });

  it('validateToken - success - return jwt data', async () => {
    await service.validateToken({
      token: mockedJwtToken,
      secretKey: mockedSignJwtSignOptions.secret.toString(),
    });

    expect(jwtService.verify).toHaveBeenCalledTimes(1);
    expect(jwtService.verify).toHaveBeenCalledWith(mockedJwtToken, {
      ignoreExpiration: false,
      secret: mockedSignJwtSignOptions.secret.toString(),
    });
  });
});
