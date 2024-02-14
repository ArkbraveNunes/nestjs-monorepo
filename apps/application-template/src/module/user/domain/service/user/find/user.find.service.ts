import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';

import { Service } from '@libs/contract';
import { REPOSITORY, REQUEST_CONTEXT } from '@common/enum';
import { UserRepositoryContract } from '@user/domain/contract';
import { UserFindServiceOutputDto } from '@user/domain/service';
import { RequestContextInterface } from '@common/request-context';

@Injectable()
export class UserFindService
  implements Service<string, Promise<UserFindServiceOutputDto>>
{
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly requestContextService: ClsService<RequestContextInterface>,
  ) {}

  async execute(): Promise<UserFindServiceOutputDto> {
    const userId = this.requestContextService.get(REQUEST_CONTEXT.USER_ID);

    return await this.userRepository.findById(userId);
  }
}
