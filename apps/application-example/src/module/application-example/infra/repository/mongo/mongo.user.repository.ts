import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { COLLECTION, MESSAGES_ERRORS, MONGO_ERROR_CODE } from '@common/enum';
import { UserSchema } from '@applicationExample/infra/schema';
import { UserEntity } from '@applicationExample/domain/entity';
import { UserRepositoryContract } from '@applicationExample/domain/contract';

@Injectable()
export class MongoUserRepository implements UserRepositoryContract {
  onlyActives: Record<string, any> = { deletedAt: null };

  constructor(
    @InjectModel(COLLECTION.USER)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async create(user: UserEntity): Promise<void> {
    const createdUser = new this.userModel({
      _id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      data: {
        profile: user.profile,
        address: user.address.map(({ id: addressId, ...addressProps }) => ({
          _id: addressId,
          ...addressProps,
        })),
      },
    });

    await createdUser.save().catch((err) => {
      throw err?.code === MONGO_ERROR_CODE.DUPLICATE_KEY
        ? new ConflictException(MESSAGES_ERRORS.USER_CONFLICT)
        : err;
    });
  }
}
