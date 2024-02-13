import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import {
  AddressCreateServiceInputDto,
  AddressCreateServiceOutputDto,
} from './address.create.service.dto';
import { Service } from '@libs/contract';
import { AddressEntity } from '@user/domain/entity';
import { REPOSITORY, REQUEST_CONTEXT } from '@common/enum';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';

@Injectable()
export class AddressCreateService
  implements
    Service<
      AddressCreateServiceInputDto,
      Promise<AddressCreateServiceOutputDto>
    >
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {}

  async execute(
    address: AddressCreateServiceInputDto,
  ): Promise<AddressCreateServiceOutputDto> {
    const userId = this.requestContextService.get(REQUEST_CONTEXT.USER_ID);

    const addressEntity = AddressEntity.create(address);

    return this.userRepository.createAddress(userId, addressEntity);
  }
}
