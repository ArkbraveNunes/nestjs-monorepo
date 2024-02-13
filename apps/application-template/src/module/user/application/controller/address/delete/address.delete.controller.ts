import {
  Controller,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AddressUpdateParamIdDto,
  AddressDeleteBadRequestOutputDto,
} from '@user/application/dto';
import { AddressDeleteService } from '@user/domain/service';
import { UserUnauthorizedOutputDto } from '@common/dto';
import { AuthJwtPassportAdapter } from '@auth/infra/adapter';
import {
  tenantHeaderOptions,
  InternalServerErrorOutputDto,
} from '@libs/common-dto';

@Controller({ version: '1' })
@ApiBearerAuth('token')
@UseGuards(AuthJwtPassportAdapter)
@ApiTags('Address')
@ApiBadRequestResponse({ type: AddressDeleteBadRequestOutputDto })
@ApiUnauthorizedResponse({ type: UserUnauthorizedOutputDto })
@ApiInternalServerErrorResponse({ type: InternalServerErrorOutputDto })
export class AddressDeleteController {
  constructor(private readonly addressDeleteService: AddressDeleteService) {}

  @ApiOperation({
    summary: 'Delete Address',
    description: 'Endpoint to delete a Address',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiHeaders([...tenantHeaderOptions])
  @Delete('/address/:addressId')
  async addressDelete(
    @Param() { addressId }: AddressUpdateParamIdDto,
  ): Promise<void> {
    await this.addressDeleteService.execute({ addressId });
  }
}
