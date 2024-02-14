import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiHeaders,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';
import {
  LoginRefreshBadRequestOutputDto,
  LoginRefreshInputDto,
  LoginRefreshOutputDto,
  LoginRefreshUnauthorizedOutputDto,
} from '@auth/application/dto';
import { LoginRefreshService } from '@auth/domain/service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
@ApiBadRequestResponse({
  type: LoginRefreshBadRequestOutputDto,
})
@ApiUnauthorizedResponse({
  type: LoginRefreshUnauthorizedOutputDto,
})
@ApiInternalServerErrorResponse({
  type: InternalServerErrorOutputDto,
})
@ApiHeaders([...tenantHeaderOptions])
export class LoginRefreshController {
  constructor(private readonly loginRefreshService: LoginRefreshService) {}

  @ApiOperation({
    summary: 'Refresh login by Refresh Token',
    description: 'Endpoint to login by Refresh Token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginRefreshOutputDto,
  })
  @Post('/login/refresh')
  async loginRefresh(
    @Body() loginRefreshInputDto: LoginRefreshInputDto,
  ): Promise<LoginRefreshOutputDto> {
    return await this.loginRefreshService
      .execute(loginRefreshInputDto)
      .then((res) => new LoginRefreshOutputDto(res));
  }
}
