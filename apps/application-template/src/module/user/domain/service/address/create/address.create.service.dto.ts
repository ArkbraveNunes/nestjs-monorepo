import { AddressProps } from '@user/domain/entity';

export type AddressCreateServiceInputDto = Omit<
  AddressProps,
  'id' | 'createdAt' | 'updatedAt'
>;
export type AddressCreateServiceOutputDto = AddressProps[];
