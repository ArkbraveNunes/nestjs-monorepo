import { ClsStore } from 'nestjs-cls';

export interface RequestContextInterface extends ClsStore {
  tenant: string;
  userId: string;
}
