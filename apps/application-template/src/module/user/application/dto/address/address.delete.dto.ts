import { ApiProperty } from '@nestjs/swagger';

import { USER_MESSAGES_ERRORS } from '@common/enum';
import { BadRequestErrorOutputDto } from '@libs/common-dto';

export class AddressDeleteBadRequestOutputDto extends BadRequestErrorOutputDto {
  @ApiProperty({
    example: [
      USER_MESSAGES_ERRORS.TENANT_IS_INVALID,
      USER_MESSAGES_ERRORS.TENANT_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_ID_IS_INVALID,
      USER_MESSAGES_ERRORS.ADDRESS_ID_IS_REQUIRED,
      USER_MESSAGES_ERRORS.ADDRESS_CANNOT_BE_DELETED,
    ],
  })
  message: USER_MESSAGES_ERRORS[];
}
