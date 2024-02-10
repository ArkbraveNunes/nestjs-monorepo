import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  ProfileSchema,
  profileSchema,
  AddressSchema,
  addressSchema,
} from '@applicationExample/infra/schema';

@Schema({
  timestamps: false,
  versionKey: false,
  _id: false,
})
export class DataSchema {
  @Prop({
    type: profileSchema,
    required: true,
  })
  profile: ProfileSchema;

  @Prop([
    {
      type: addressSchema,
      required: true,
    },
  ])
  address: AddressSchema[];
}

export const dataSchema = SchemaFactory.createForClass(DataSchema);
