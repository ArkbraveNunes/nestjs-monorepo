import { Inject, Injectable } from '@nestjs/common';

import {
  HistoryCreateServiceInput,
  FormatFieldUpdatedInput,
  FormatFieldUpdatedOutput,
  CompareOldDataAndNewDataInput,
  CompareOldDataAndNewDataOutput,
} from './history.create.service.dto';
import { Service } from '@libs/contract';
import { HistoryRepositoryContract } from '@history/domain/contract';
import { HISTORY_ACTION, HISTORY_TYPE, REPOSITORY } from '@common/enum';
import { FieldUpdatedProps, HistoryEntity } from '@history/domain/entity';

@Injectable()
export class HistoryCreateService
  implements Service<HistoryCreateServiceInput, Promise<void>>
{
  constructor(
    @Inject(REPOSITORY.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryContract,
  ) {}

  async execute({
    user,
    fieldUpdated,
    action,
  }: HistoryCreateServiceInput): Promise<void> {
    const typeIsUser = fieldUpdated.type === HISTORY_TYPE.USER;
    let oldUser = null;

    if (!typeIsUser && action !== HISTORY_ACTION.CREATE) {
      oldUser = (await this.historyRepository.findById(user._id.toString()))
        .user;
    }

    let fieldUpdatedProps: FieldUpdatedProps;
    const userId: string = user._id.toString();

    switch (action) {
      case HISTORY_ACTION.CREATE:
        fieldUpdatedProps = {
          type: fieldUpdated.type,
          oldValue: null,
          newValue: fieldUpdated.value,
          modifiedFields: [],
        };
        break;
      case HISTORY_ACTION.UPDATE:
        fieldUpdatedProps = this.formatFieldUpdated({
          oldUser,
          fieldUpdated,
        });
        fieldUpdatedProps.modifiedFields = this.compareOldDataWithNewData({
          oldValue: fieldUpdatedProps.oldValue,
          newValue: fieldUpdatedProps.newValue,
        });
        break;
      case HISTORY_ACTION.DELETE:
        fieldUpdatedProps = {
          type: fieldUpdated.type,
          oldValue: typeIsUser ? oldUser : oldUser.data[fieldUpdated.type],
          newValue: typeIsUser ? user : user.data[fieldUpdated.type],
          modifiedFields: typeIsUser ? ['deletedAt'] : [fieldUpdated.type],
        };
        break;
    }

    await this.historyRepository.create(
      HistoryEntity.create({
        userId,
        user,
        action,
        fieldUpdated: fieldUpdatedProps,
      }),
    );
  }

  private formatFieldUpdated({
    oldUser,
    fieldUpdated: { type, value: newValue },
  }: FormatFieldUpdatedInput): FormatFieldUpdatedOutput {
    const formatDataOutput: FormatFieldUpdatedOutput = {
      type,
      oldValue: null,
      newValue: null,
      modifiedFields: [],
    };

    switch (type) {
      case HISTORY_TYPE.PROFILE:
        formatDataOutput.oldValue = oldUser.data[type];
        formatDataOutput.newValue = newValue;
        break;
      case HISTORY_TYPE.ADDRESS:
        formatDataOutput.oldValue = oldUser.data.address.find(
          ({ _id: addressId }) =>
            addressId.toString() === newValue._id.toString(),
        );
        formatDataOutput.newValue = newValue;
        break;
    }

    return formatDataOutput;
  }

  private compareOldDataWithNewData({
    oldValue,
    newValue,
  }: CompareOldDataAndNewDataInput): CompareOldDataAndNewDataOutput {
    let modifiedFields: CompareOldDataAndNewDataOutput = [];

    if (oldValue && newValue) {
      const [flatObjectOldValue, flatObjectNewValue] = [
        this.flatObject(oldValue),
        this.flatObject(newValue),
      ];

      modifiedFields = Object.entries(flatObjectNewValue)
        .map(([newKey, newValue]) =>
          (Array.isArray(newValue) &&
            newValue.some(
              (value) => !flatObjectOldValue[newKey].includes(value),
            )) ||
          newValue !== flatObjectOldValue[newKey]
            ? newKey
            : null,
        )
        .filter((modifiedField) => !!modifiedField);
    }
    return modifiedFields;
  }

  private flatObject(objectProps: Record<string, any>): Record<string, any> {
    const result = {};

    for (const prop in objectProps) {
      if (
        objectProps[prop] &&
        typeof objectProps[prop] === 'object' &&
        !Array.isArray(objectProps[prop])
      ) {
        const subObject = this.flatObject(objectProps[prop]);
        for (const subProp in subObject) {
          result[prop + '.' + subProp] = subObject[subProp];
        }
      } else {
        result[prop] = objectProps[prop];
      }
    }
    return result;
  }
}
