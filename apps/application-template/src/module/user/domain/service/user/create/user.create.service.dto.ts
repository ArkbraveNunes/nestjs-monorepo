import { AddressProps, ProfileProps } from '@user/domain/entity';
import { USER_MESSAGES_SUCCESS } from '@common/enum';

export type UserCreateServiceInputDto = Pick<
  ProfileProps,
  'birthDate' | 'cpf' | 'email' | 'gender' | 'name' | 'password' | 'phoneNumber'
> & {
  address: Omit<AddressProps, 'id' | 'createdAt' | 'updatedAt'>;
};

export type UserCreateServiceOutputDto = {
  id: string;
  message: USER_MESSAGES_SUCCESS[];
};
