import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import {
  AddressUpdateServiceInput,
  AddressUpdateServiceOutput,
} from './address.update.service.dto';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { Service } from '@libs/contract';
import { REPOSITORY, REQUEST_CONTEXT } from '@common/enum';

@Injectable()
export class AddressUpdateService
  implements
    Service<AddressUpdateServiceInput, Promise<AddressUpdateServiceOutput>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {}

  async execute(
    addressUpdateServiceInput: AddressUpdateServiceInput,
  ): Promise<AddressUpdateServiceOutput> {
    const userId = this.requestContextService.get(REQUEST_CONTEXT.USER_ID);

    return await this.userRepository.updateAddress(userId, {
      ...addressUpdateServiceInput,
    });
  }
}
