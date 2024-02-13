import { CreateRepository, FindByIdRepository } from '@libs/contract';
import { AddressProps, ProfileProps, UserEntity } from '@user/domain/entity';

export interface UserRepositoryContract
  extends CreateRepository<UserEntity>,
    FindByIdRepository<UserEntity> {
  findByEmail({ email }: Pick<ProfileProps, 'email'>): Promise<UserEntity>;
  updateUserProfile(
    userId: string,
    profile: Partial<ProfileProps>,
  ): Promise<ProfileProps>;
  createAddress(userId: string, address: AddressProps): Promise<AddressProps[]>;
  updateAddress(
    userId: string,
    address: { addressId: string } & Partial<Omit<AddressProps, 'id'>>,
  ): Promise<AddressProps>;
  deleteAddress(
    userId: string,
    { addressId }: { addressId: string },
  ): Promise<AddressProps[]>;
}
