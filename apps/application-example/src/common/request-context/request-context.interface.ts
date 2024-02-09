import { ClsStore } from 'nestjs-cls';

export interface RequestContextInterface extends ClsStore {
  tenant: string;
  customerId: string;
  ip: string;
  fingerprint: string;
  isRecoveryPassword: boolean;
}
