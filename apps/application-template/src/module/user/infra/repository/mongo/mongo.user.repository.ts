import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { COLLECTION, MESSAGES_ERRORS, MONGO_ERROR_CODE } from '@common/enum';
import { UserSchema } from '@user/infra/schema';
import { ProfileProps, UserEntity } from '@user/domain/entity';
import { UserRepositoryContract } from '@user/domain/contract';

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

  async findById(id: string): Promise<UserEntity> {
    const docResult = await this.userModel
      .findOne({ _id: id, ...this.onlyActives })
      .lean();

    if (!docResult) {
      throw new NotFoundException(MESSAGES_ERRORS.USER_DOES_NOT_EXIST);
    }

    return UserEntity.fromDbToEntity(docResult);
  }

  async findByEmail({
    email,
  }: Pick<ProfileProps, 'email'>): Promise<UserEntity> {
    const docResult = await this.userModel
      .findOne({
        'data.profile.email': email,
      })
      .lean();
    return docResult ? UserEntity.fromDbToEntity(docResult) : null;
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<ProfileProps>,
  ): Promise<ProfileProps> {
    const query = {};

    Object.keys(profile).forEach((key) => {
      const queryKey = `data.profile.${key}`;
      query[queryKey] = profile[key];
    });

    const docResult = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          ...this.onlyActives,
        },
        query,
        { new: true },
      )
      .lean();

    return UserEntity.fromDbToEntity(docResult).profile;
  }
}
