import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { Service } from '@libs/contract';
import {
  USER_MESSAGES_ERRORS,
  REPOSITORY,
  REQUEST_CONTEXT,
} from '@common/enum';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { AddressDeleteServiceInput } from './address.delete.service.dto';

@Injectable()
export class AddressDeleteService
  implements Service<AddressDeleteServiceInput, Promise<void>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {}

  async execute({ addressId }: AddressDeleteServiceInput): Promise<void> {
    const userId = this.requestContextService.get(REQUEST_CONTEXT.USER_ID);

    const { address } = await this.userRepository.findById(userId);

    if (address.length < 2 && address.map(({ id }) => id).includes(addressId)) {
      throw new BadRequestException(
        USER_MESSAGES_ERRORS.ADDRESS_CANNOT_BE_DELETED,
      );
    }

    await this.userRepository.deleteAddress(userId, {
      addressId,
    });
  }
}
