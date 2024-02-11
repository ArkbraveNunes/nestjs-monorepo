import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse,
  ApiHeaders,
  ApiOperation,
} from '@nestjs/swagger';

import {
  LoginControllerBadRequestOutputDto,
  LoginControllerInputDto,
  LoginControllerOutputDto,
  LoginControllerUnauthorizedOutputDto,
} from '@auth/application/dto';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';
import { LoginService } from '@auth/domain/service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
@ApiBadRequestResponse({
  type: LoginControllerBadRequestOutputDto,
})
@ApiInternalServerErrorResponse({
  type: InternalServerErrorOutputDto,
})
@ApiUnauthorizedResponse({
  type: LoginControllerUnauthorizedOutputDto,
})
@ApiHeaders([...tenantHeaderOptions])
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({
    summary: 'Login by email and password',
    description: 'Endpoint to login by email and password',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginControllerOutputDto,
  })
  @Post('/login')
  async login(
    @Body() loginControllerInputDto: LoginControllerInputDto,
  ): Promise<LoginControllerOutputDto> {
    return await this.loginService
      .execute(loginControllerInputDto)
      .then((res) => new LoginControllerOutputDto(res));
  }
}
