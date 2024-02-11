import { Types } from 'mongoose';

import { Entity } from '@libs/contract';
import { AddressProps } from '@user/domain/entity';

export type CreateAddressProps = Pick<
  AddressProps,
  | 'city'
  | 'complement'
  | 'country'
  | 'district'
  | 'number'
  | 'state'
  | 'street'
  | 'zipCode'
  | 'coordinates'
>;

export type DbAddressProps = Omit<AddressProps, 'id'> & { _id: Types.ObjectId };

export class AddressEntity extends Entity {
  id: string;
  alias?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode: string;
  coordinates?: {
    latitude: string;
    longitude: string;
  };
  createdAt: string;
  updatedAt: string;

  constructor(props: AddressProps) {
    super(props);
    Object.assign(this, props);
  }

  static create(props: CreateAddressProps): AddressEntity {
    const id = new Types.ObjectId().toString();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    return new AddressEntity({ ...props, id, createdAt, updatedAt });
  }

  static fromDbToEntity(props: DbAddressProps): AddressEntity {
    return new AddressEntity({
      id: props._id.toString(),
      street: props.street,
      number: props.number,
      complement: props.complement,
      district: props.district,
      city: props.city,
      state: props.state,
      country: props.country,
      zipCode: props.zipCode,
      coordinates: props.coordinates,
      createdAt: new Date(props.createdAt).toISOString(),
      updatedAt: new Date(props.updatedAt).toISOString(),
    });
  }
}
