import { MESSAGES_SUCCESS } from '@common/enum';
import { ProfileProps } from '@user/domain/entity';

export type UserUpdateServiceInputDto = Pick<
  Partial<ProfileProps>,
  'name' | 'phoneNumber' | 'gender' | 'email'
>;
export type UserUpdateServiceOutputDto = {
  message: MESSAGES_SUCCESS[];
};
