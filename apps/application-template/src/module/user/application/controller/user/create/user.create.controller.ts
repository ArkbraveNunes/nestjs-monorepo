import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  UserCreateBadRequestOutputDto,
  UserCreateConflictOutputDto,
  UserCreateInputDto,
  UserCreateOutputDto,
} from '@user/application/dto';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';
import { UserCreateService } from '@user/domain/service';

@ApiTags('User')
@ApiBadRequestResponse({ type: UserCreateBadRequestOutputDto })
@ApiConflictResponse({ type: UserCreateConflictOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
@Controller({ version: '1' })
export class UserCreateController {
  constructor(private readonly userCreateService: UserCreateService) {}

  @ApiOperation({
    summary: 'Create User',
    description: 'Endpoint to create a User',
  })
  @ApiCreatedResponse({
    type: UserCreateOutputDto,
  })
  @ApiHeaders([...tenantHeaderOptions])
  @Post()
  async create(
    @Body() userCreateInputDto: UserCreateInputDto,
  ): Promise<UserCreateOutputDto> {
    return await this.userCreateService
      .execute({
        ...userCreateInputDto,
      })
      .then((res) => new UserCreateOutputDto(res));
  }
}
