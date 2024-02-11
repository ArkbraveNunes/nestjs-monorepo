import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  UserUpdateBadRequestOutputDto,
  UserUpdateInputDto,
  UserUpdateOutputDto,
  UserUpdateUnauthorizedOutputDto,
} from '@user/application/dto';
import { UserUpdateService } from '@user/domain/service';
import { AuthJwtPassportAdapter } from '@auth/infra/adapter';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';

@ApiTags('User')
@ApiBearerAuth('token')
@UseGuards(AuthJwtPassportAdapter)
@Controller({ version: '1' })
@ApiBadRequestResponse({ type: UserUpdateBadRequestOutputDto })
@ApiUnauthorizedResponse({ type: UserUpdateUnauthorizedOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
export class UserUpdateController {
  constructor(private readonly updateUserService: UserUpdateService) {}

  @ApiOperation({
    summary: 'Update User',
    description: 'Endpoint to update a User',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserUpdateOutputDto,
  })
  @ApiHeaders([...tenantHeaderOptions])
  @Patch()
  async update(
    @Body() updateUserInputDto: UserUpdateInputDto,
  ): Promise<UserUpdateOutputDto> {
    return await this.updateUserService
      .execute({
        ...updateUserInputDto,
      })
      .then((res) => new UserUpdateOutputDto(res));
  }
}
