import { ApiProperty } from '@nestjs/swagger';

import { UnauthorizedErrorOutputDto } from '@libs/common-dto';
import { MESSAGES_ERRORS } from '@common/enum';

export class UserUnauthorizedOutputDto extends UnauthorizedErrorOutputDto {
  @ApiProperty({
    example: [MESSAGES_ERRORS.USER_UNAUTHORIZED],
  })
  message: MESSAGES_ERRORS[];
}
