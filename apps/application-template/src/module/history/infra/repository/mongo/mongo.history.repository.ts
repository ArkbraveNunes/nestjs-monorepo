import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { HistorySchema } from '@history/infra/schema';
import { HistoryEntity } from '@history/domain/entity';
import { COLLECTION, HISTORY_MESSAGES_ERRORS } from '@common/enum';
import { HistoryRepositoryContract } from '@history/domain/contract';

@Injectable()
export class HistoryRepository implements HistoryRepositoryContract {
  constructor(
    @InjectModel(COLLECTION.HISTORY)
    private readonly historyModel: Model<HistorySchema>,
  ) {}

  async create(history: HistoryEntity): Promise<void> {
    const createdHistory = new this.historyModel({
      _id: history.id,
      user: history.user,
      userId: history.userId,
      action: history.action,
      fieldUpdated: history.fieldUpdated,
      createdAt: history.createdAt,
    });

    await createdHistory.save();
  }

  async findById(userId: string): Promise<HistoryEntity> {
    const [docResult] = await this.historyModel
      .find({ userId: userId })
      .sort({ createsAt: -1 })
      .limit(1)
      .lean();

    if (!docResult) {
      throw new NotFoundException(HISTORY_MESSAGES_ERRORS.HISTORY_NOT_FOUND);
    }

    return HistoryEntity.fromDbToEntity(docResult);
  }
}
