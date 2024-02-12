import { MockProxy, mock } from 'jest-mock-extended';
import { AddressCreateController } from '@user/application/controller';
import { AddressCreateService } from '@user/domain/service';
import { mockedAddressEntity } from '@test/mock';
import { InternalServerErrorException } from '@nestjs/common';
import { MESSAGES_ERRORS } from '@common/enum';
import { AddressCreateInputDto } from '@user/application/dto';

describe('AddressCreateController', () => {
  let controller: AddressCreateController;
  let mockedAddressCreateService: MockProxy<AddressCreateService>;

  const addressCreateInputDto: AddressCreateInputDto = {
    ...mockedAddressEntity(),
  };

  beforeEach(() => {
    mockedAddressCreateService = mock();
    mockedAddressCreateService.execute.mockResolvedValue([
      mockedAddressEntity(),
    ]);

    controller = new AddressCreateController(mockedAddressCreateService);
  });

  describe('addressCreate', () => {
    it('should call AddressCreateService - success', async () => {
      await controller.addressCreate({
        ...addressCreateInputDto,
      });

      expect(mockedAddressCreateService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call AddressCreateService - error', async () => {
      mockedAddressCreateService.execute.mockRejectedValue(
        new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
      );

      await controller
        .addressCreate({
          ...addressCreateInputDto,
        })
        .catch((actualError) => {
          expect(mockedAddressCreateService.execute).toHaveBeenCalledTimes(1);
          expect(actualError).toBeInstanceOf(InternalServerErrorException);
        });
    });
  });
});
