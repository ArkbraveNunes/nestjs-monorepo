import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AddressCreateBadRequestOutputDto,
  AddressCreateInputDto,
} from '@user/application/dto';
import { AddressCreateService } from '@user/domain/service';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';
import { UserUnauthorizedOutputDto } from '@common/dto';
import { AuthJwtPassportAdapter } from '@auth/infra/adapter';

@ApiTags('Address')
@ApiBearerAuth('token')
@UseGuards(AuthJwtPassportAdapter)
@ApiBadRequestResponse({ type: AddressCreateBadRequestOutputDto })
@ApiUnauthorizedResponse({ type: UserUnauthorizedOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
@Controller({ version: '1' })
export class AddressCreateController {
  constructor(private readonly addressCreateService: AddressCreateService) {}

  @ApiOperation({
    summary: 'Create Address',
    description: 'Endpoint to create a Address',
  })
  @ApiCreatedResponse()
  @ApiHeaders([...tenantHeaderOptions])
  @Post('/address')
  async addressCreate(
    @Body() addressCreateInputDto: AddressCreateInputDto,
  ): Promise<void> {
    await this.addressCreateService.execute(addressCreateInputDto);
  }
}
