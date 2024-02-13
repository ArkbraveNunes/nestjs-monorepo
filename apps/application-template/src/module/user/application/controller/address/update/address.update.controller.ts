import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
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
  AddressUpdateParamIdDto,
  AddressUpdateBadRequestOutputDto,
  AddressUpdateInputDto,
  AddressUpdateOutputDto,
} from '@user/application/dto';
import { AddressUpdateService } from '@user/domain/service';
import { AuthJwtPassportAdapter } from '@auth/infra/adapter';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';
import { UserUnauthorizedOutputDto } from '@common/dto';
import { MESSAGES_SUCCESS } from '@common/enum';

@Controller({ version: '1' })
@ApiBearerAuth('token')
@UseGuards(AuthJwtPassportAdapter)
@ApiTags('Address')
@ApiBadRequestResponse({ type: AddressUpdateBadRequestOutputDto })
@ApiUnauthorizedResponse({ type: UserUnauthorizedOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
export class AddressUpdateController {
  constructor(private readonly updateAddressService: AddressUpdateService) {}

  @ApiOperation({
    summary: 'Update Address',
    description: 'Endpoint to update a Address',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AddressUpdateOutputDto,
  })
  @ApiHeaders([...tenantHeaderOptions])
  @Patch('/address/:addressId')
  async addressUpdate(
    @Param() { addressId }: AddressUpdateParamIdDto,
    @Body() updateAddressInputDto: AddressUpdateInputDto,
  ): Promise<AddressUpdateOutputDto> {
    await this.updateAddressService.execute({
      addressId,
      ...updateAddressInputDto,
    });

    return { message: [MESSAGES_SUCCESS.ADDRESS_UPDATED_WITH_SUCCESS] };
  }
}
