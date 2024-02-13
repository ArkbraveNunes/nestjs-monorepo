import { MockProxy, mock } from 'jest-mock-extended';
import { AddressDeleteController } from '@user/application/controller';
import { AddressDeleteService } from '@user/domain/service';
import { mockedAddressEntity } from '@test/mock';
import { InternalServerErrorException } from '@nestjs/common';
import { MESSAGES_ERRORS } from '@common/enum';

describe('AddressDeleteController', () => {
  let controller: AddressDeleteController;
  let mockedAddressDeleteService: MockProxy<AddressDeleteService>;

  beforeEach(() => {
    mockedAddressDeleteService = mock();
    mockedAddressDeleteService.execute.mockResolvedValue(void 0);

    controller = new AddressDeleteController(mockedAddressDeleteService);
  });

  describe('addressDelete', () => {
    it('should call AddressDeleteService - success', async () => {
      await controller.addressDelete({ addressId: mockedAddressEntity().id });

      expect(mockedAddressDeleteService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call AddressDeleteService - error', async () => {
      mockedAddressDeleteService.execute.mockRejectedValue(
        new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
      );

      await controller
        .addressDelete({ addressId: mockedAddressEntity().id })
        .catch((actualError) => {
          expect(mockedAddressDeleteService.execute).toHaveBeenCalledTimes(1);
          expect(actualError).toBeInstanceOf(InternalServerErrorException);
        });
    });
  });
});
