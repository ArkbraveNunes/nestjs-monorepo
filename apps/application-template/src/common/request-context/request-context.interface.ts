import { ClsStore } from 'nestjs-cls';

export interface RequestContextInterface extends ClsStore {
  tenantId: string;
}
