import { HISTORY_ACTION, HISTORY_TYPE } from '@common/enum';
import { FieldUpdatedProps } from '@history/domain/entity';

export type HistoryCreateServiceInput = {
  user: Record<string, any>;
  fieldUpdated: {
    type: HISTORY_TYPE;
    value: Record<string, any>;
  };
  action: HISTORY_ACTION;
};

export type FormatFieldUpdatedInput = {
  oldUser: Record<string, any>;
} & Pick<HistoryCreateServiceInput, 'fieldUpdated'>;
export type FormatFieldUpdatedOutput = FieldUpdatedProps;

export type CompareOldDataAndNewDataInput = Pick<
  FieldUpdatedProps,
  'oldValue' | 'newValue'
>;
export type CompareOldDataAndNewDataOutput = string[];
