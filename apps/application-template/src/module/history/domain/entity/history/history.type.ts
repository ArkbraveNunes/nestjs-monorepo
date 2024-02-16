import { HISTORY_ACTION, HISTORY_TYPE } from '@common/enum';

export type FieldUpdatedProps = {
  type: HISTORY_TYPE;
  oldValue: Record<string, any>;
  newValue: Record<string, any>;
  modifiedFields: string[];
};

export type HistoryProps = {
  id: string;
  user: Record<string, any>;
  userId: string;
  action: HISTORY_ACTION;
  fieldUpdated: FieldUpdatedProps;
  createdAt: string;
};
