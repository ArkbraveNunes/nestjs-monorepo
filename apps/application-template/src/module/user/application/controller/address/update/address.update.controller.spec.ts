import { MockProxy, mock } from 'jest-mock-extended';
import { InternalServerErrorException } from '@nestjs/common';

import {
  AddressUpdateInputDto,
  AddressUpdateParamIdDto,
} from '@user/application/dto';
import { MESSAGES_ERRORS } from '@common/enum';
import { mockedAddressEntity } from '@test/mock';
import { AddressUpdateService } from '@user/domain/service';
import { AddressUpdateController } from '@user/application/controller';

describe('AddressUpdateController', () => {
  let controller: AddressUpdateController;
  let mockedAddressUpdateService: MockProxy<AddressUpdateService>;

  const addressUpdateParamIdDto: AddressUpdateParamIdDto = {
    addressId: mockedAddressEntity().id,
  };
  const addressUpdateInputDto: AddressUpdateInputDto = {
    ...mockedAddressEntity(),
  };

  beforeEach(() => {
    mockedAddressUpdateService = mock();
    mockedAddressUpdateService.execute.mockResolvedValue(mockedAddressEntity());

    controller = new AddressUpdateController(mockedAddressUpdateService);
  });

  describe('addressUpdate', () => {
    it('should call AddressUpdateService - success', async () => {
      await controller.addressUpdate(
        addressUpdateParamIdDto,
        addressUpdateInputDto,
      );

      expect(mockedAddressUpdateService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call AddressUpdateService - error', async () => {
      mockedAddressUpdateService.execute.mockRejectedValue(
        new InternalServerErrorException(MESSAGES_ERRORS.INTERNAL_SERVER_ERROR),
      );

      await controller
        .addressUpdate(addressUpdateParamIdDto, addressUpdateInputDto)
        .catch((actualError) => {
          expect(mockedAddressUpdateService.execute).toHaveBeenCalledTimes(1);
          expect(actualError).toBeInstanceOf(InternalServerErrorException);
        });
    });
  });
});
