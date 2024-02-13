import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';

import {
  UserUpdateServiceInputDto,
  UserUpdateServiceOutputDto,
} from './user.update.service.dto';
import { Service } from '@libs/contract';
import { ProfileProps } from '@user/domain/entity';
import { UserRepositoryContract } from '@user/domain/contract';
import { RequestContextInterface } from '@common/request-context';
import { MESSAGES_SUCCESS, REPOSITORY, REQUEST_CONTEXT } from '@common/enum';

@Injectable()
export class UserUpdateService
  implements
    Service<UserUpdateServiceInputDto, Promise<UserUpdateServiceOutputDto>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {}

  async execute(
    updateCustomerServiceInputDto: UserUpdateServiceInputDto,
  ): Promise<UserUpdateServiceOutputDto> {
    const userId = this.requestContextService.get(REQUEST_CONTEXT.USER_ID);

    const profileData: Partial<ProfileProps> = updateCustomerServiceInputDto;

    await this.userRepository.updateUserProfile(userId, profileData);

    return {
      message: [MESSAGES_SUCCESS.USER_UPDATED_WITH_SUCCESS],
    };
  }
}
