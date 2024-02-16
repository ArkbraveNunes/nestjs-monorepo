import { ApiProperty } from '@nestjs/swagger';

import { UnauthorizedErrorOutputDto } from '@libs/common-dto';
import { USER_MESSAGES_ERRORS } from '@common/enum';

export class UserUnauthorizedOutputDto extends UnauthorizedErrorOutputDto {
  @ApiProperty({
    example: [USER_MESSAGES_ERRORS.USER_UNAUTHORIZED],
  })
  message: USER_MESSAGES_ERRORS[];
}
