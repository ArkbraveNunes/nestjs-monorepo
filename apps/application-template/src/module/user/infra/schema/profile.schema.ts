import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ProfileProps } from '@user/domain/entity';
import { USER_GENDER } from '@common/enum';

@Schema({
  timestamps: false,
  versionKey: false,
  _id: false,
})
export class ProfileSchema implements ProfileProps {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  cpf: string;

  @Prop({
    required: true,
  })
  phoneNumber: string;

  @Prop({
    required: true,
  })
  birthDate: Date;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    default: '',
  })
  password: string;

  @Prop({
    type: String,
    enum: USER_GENDER,
  })
  gender: USER_GENDER;
}

export const profileSchema = SchemaFactory.createForClass(ProfileSchema);
