import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  UserFindOutputDto,
  UserFindBadRequestOutputDto,
} from '@user/application/dto';
import { UserFindService } from '@user/domain/service';
import { UserUnauthorizedOutputDto } from '@common/dto';
import { AuthJwtPassportAdapter } from '@auth/infra/adapter';
import {
  InternalServerErrorOutputDto,
  tenantHeaderOptions,
} from '@libs/common-dto';

@ApiTags('User')
@ApiBearerAuth('token')
@Controller({ version: '1' })
@UseGuards(AuthJwtPassportAdapter)
@ApiBadRequestResponse({ type: UserFindBadRequestOutputDto })
@ApiUnauthorizedResponse({ type: UserUnauthorizedOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
export class UserFindController {
  constructor(private readonly userFindService: UserFindService) {}

  @ApiOperation({
    summary: 'Get User Data',
    description: 'Endpoint to get User data',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserFindOutputDto })
  @ApiHeaders([...tenantHeaderOptions])
  @Get('/user')
  async userFind(): Promise<UserFindOutputDto> {
    return await this.userFindService
      .execute()
      .then((res) => new UserFindOutputDto(res));
  }
}
