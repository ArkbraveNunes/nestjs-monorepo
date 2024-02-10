import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

import { AddressProps } from '@applicationExample/domain/entity';

@Schema({
  timestamps: false,
  versionKey: false,
  _id: false,
})
class Coordinates {
  @Prop({
    default: '',
  })
  latitude: string;

  @Prop({
    default: '',
  })
  longitude: string;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AddressSchema implements Omit<AddressProps, 'id'> {
  _id: Types.ObjectId;

  @Prop({
    default: '',
  })
  street: string;

  @Prop({
    default: '',
  })
  number: string;

  @Prop({
    default: '',
  })
  complement: string;

  @Prop({
    default: '',
  })
  district: string;

  @Prop({
    default: '',
  })
  city: string;

  @Prop({
    default: '',
  })
  state: string;

  @Prop({
    default: '',
  })
  country: string;

  @Prop({
    default: '',
  })
  zipCode: string;

  @Prop({
    default: null,
  })
  coordinates: Coordinates;

  @Transform(({ value }) => new Date(value).toISOString())
  createdAt: string;

  @Transform(({ value }) => new Date(value).toISOString())
  updatedAt: string;
}

export const addressSchema = SchemaFactory.createForClass(AddressSchema);
