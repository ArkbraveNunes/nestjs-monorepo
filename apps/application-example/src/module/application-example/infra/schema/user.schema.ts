import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

import { DataSchema, dataSchema } from '@applicationExample/infra/schema';

export type UserDocument = UserSchema & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UserSchema {
  _id: Types.ObjectId;

  @Prop({
    type: dataSchema,
    required: true,
  })
  data: DataSchema;

  @Prop({
    default: null,
  })
  deletedAt: string;

  @Transform(({ value }) => new Date(value).toISOString())
  createdAt: string;

  @Transform(({ value }) => new Date(value).toISOString())
  updatedAt: string;
}

export const userSchema = SchemaFactory.createForClass(UserSchema)
  .index({ 'data.profile.email': 1 }, { unique: true })
  .index({ 'data.profile.phoneNumber': 1 }, { unique: true })
  .index({ 'data.profile.cpf': 1 }, { unique: true });
