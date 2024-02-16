import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HISTORY_ACTION, HISTORY_TYPE } from '@common/enum';
import { FieldUpdatedProps } from '@history/domain/entity';

export type HistoryDocument = HistorySchema & Document;

@Schema({
  timestamps: false,
  versionKey: false,
  _id: false,
})
class FieldUpdated implements FieldUpdatedProps {
  @Prop({
    default: null,
    type: String,
    enum: HISTORY_TYPE,
  })
  type: HISTORY_TYPE;

  @Prop({
    default: null,
    type: Object,
  })
  oldValue: Record<string, any>;

  @Prop({
    default: null,
    type: Object,
  })
  newValue: Record<string, any>;

  @Prop([
    {
      type: String,
    },
  ])
  modifiedFields: string[];
}

@Schema({
  timestamps: { createdAt: true },
  versionKey: false,
})
export class HistorySchema {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
    type: Object,
  })
  user: Record<string, any>;

  @Prop({
    required: true,
    type: String,
    enum: HISTORY_ACTION,
  })
  action: HISTORY_ACTION;

  @Prop({
    default: null,
  })
  fieldUpdated: FieldUpdated;

  @Transform(({ value }) => new Date(value).toISOString())
  createdAt: string;
}

export const historySchema =
  SchemaFactory.createForClass(HistorySchema).clearIndexes();
