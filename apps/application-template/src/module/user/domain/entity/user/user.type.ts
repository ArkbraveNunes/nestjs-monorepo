import { USER_GENDER } from '@common/enum';

export type ProfileProps = {
  name: string;
  cpf: string;
  phoneNumber: string;
  birthDate: Date;
  email: string;
  password: string;
  gender: USER_GENDER;
};
