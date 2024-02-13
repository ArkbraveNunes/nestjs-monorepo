import { ApiProperty } from '@nestjs/swagger';

import { MESSAGES_ERRORS } from '@common/enum';
import { BadRequestErrorOutputDto } from '@libs/common-dto';

export class AddressDeleteBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      MESSAGES_ERRORS.TENANT_IS_INVALID,
      MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_ID_IS_INVALID,
      MESSAGES_ERRORS.ADDRESS_ID_IS_REQUIRED,
      MESSAGES_ERRORS.ADDRESS_CANNOT_BE_DELETED,
    ],
  })
  message: MESSAGES_ERRORS[];
}
