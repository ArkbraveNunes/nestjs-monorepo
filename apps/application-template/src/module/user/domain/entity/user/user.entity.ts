import { Types } from 'mongoose';

import { AddressEntity, AddressProps, ProfileProps } from '@user/domain/entity';
import { Entity } from '@libs/contract';

export type UserProps = Pick<
  UserEntity,
  'id' | 'profile' | 'address' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type CreateUserProps = Pick<UserEntity, 'profile'> & {
  address: Omit<AddressProps, 'id' | 'createdAt' | 'updatedAt'>[];
};

export type DbUserProps = { _id: Types.ObjectId } & Pick<
  UserEntity,
  'createdAt' | 'updatedAt' | 'deletedAt'
> & {
    data: Pick<UserProps, 'profile'> & {
      address: (Omit<AddressProps, 'id'> & { _id: Types.ObjectId })[];
    };
  };

export class UserEntity extends Entity {
  profile: ProfileProps;
  address: AddressEntity[];
  updatedAt: string;
  deletedAt?: string;

  constructor(props: UserProps) {
    super(props);
    Object.assign(this, props);
  }

  static create(props: CreateUserProps): UserEntity {
    const id = new Types.ObjectId().toString();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const deletedAt = null;
    const address = props.address.map((item) =>
      AddressEntity.create({ ...item }),
    );
    return new UserEntity({
      ...props,
      id,
      createdAt,
      updatedAt,
      deletedAt,
      address,
    });
  }

  static fromDbToEntity(props: DbUserProps): UserEntity {
    return new UserEntity({
      id: props._id.toString(),
      profile: props.data.profile,
      address: props.data.address.map((address) =>
        AddressEntity.fromDbToEntity(address),
      ),
      createdAt: new Date(props.createdAt).toISOString(),
      updatedAt: new Date(props.updatedAt).toISOString(),
      deletedAt: props.deletedAt
        ? new Date(props.deletedAt).toISOString()
        : null,
    });
  }
}
