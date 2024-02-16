import { AddressSchema, UserSchema, ProfileSchema } from '@user/infra/schema';

export type UserCreateListenerInput = {
  document: UserSchema;
};

export type AddressCreateListenerInput = {
  document: UserSchema;
  newAddress: AddressSchema;
};

export type AddressUpdateListenerInput = {
  document: UserSchema;
  address: AddressSchema;
};

export type ProfileUpdateListenerInput = {
  document: UserSchema;
  profile: ProfileSchema;
};

export type AddressDeleteListenerInput = {
  document: UserSchema;
  address: AddressSchema;
};
