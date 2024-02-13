import { AddressEntity, AddressProps } from '@user/domain/entity';

export type AddressUpdateServiceInput = { addressId: string } & Partial<
  Omit<AddressProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type AddressUpdateServiceOutput = AddressEntity;
