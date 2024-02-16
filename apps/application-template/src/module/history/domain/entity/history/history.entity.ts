import { Types } from 'mongoose';

import { Entity } from '@libs/contract';
import { HistoryProps } from '@history/domain/entity';
import { HISTORY_ACTION } from '@common/enum';
import { FieldUpdatedProps } from './history.type';

export type HistoryCreateProps = Pick<
  HistoryProps,
  'user' | 'userId' | 'action' | 'fieldUpdated'
>;

export type DbHistoryProps = { _id: Types.ObjectId } & Omit<HistoryProps, 'id'>;

export class HistoryEntity extends Entity {
  id: string;
  user: Record<string, any>;
  userId: string;
  action: HISTORY_ACTION;
  fieldUpdated: FieldUpdatedProps;
  createdAt: string;

  constructor(props: HistoryProps) {
    super(props);
    Object.assign(this, props);
  }

  static create({ ...props }: HistoryCreateProps): HistoryEntity {
    const id = new Types.ObjectId().toString();
    const createdAt = new Date().toISOString();
    return new HistoryEntity({ ...props, id, createdAt });
  }

  static fromDbToEntity(props: DbHistoryProps): HistoryEntity {
    return new HistoryEntity({
      id: props._id.toString(),
      user: props.user,
      userId: props.userId,
      action: props.action,
      fieldUpdated: props.fieldUpdated,
      createdAt: new Date(props.createdAt).toISOString(),
    });
  }
}
