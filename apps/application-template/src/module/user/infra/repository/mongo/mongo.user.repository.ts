import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  COLLECTION,
  USER_MESSAGES_ERRORS,
  MONGO_ERROR_CODE,
  USER_LISTENER,
} from '@common/enum';
import { UserSchema } from '@user/infra/schema';
import { AddressProps, ProfileProps, UserEntity } from '@user/domain/entity';
import { UserRepositoryContract } from '@user/domain/contract';
import { MongoHelper } from './helper/mongo.helper';
import { EventEmitterService } from '@libs/event-emitter';

@Injectable()
export class MongoUserRepository implements UserRepositoryContract {
  onlyActives: Record<string, any> = { deletedAt: null };

  constructor(
    @InjectModel(COLLECTION.USER)
    private readonly userModel: Model<UserSchema>,
    private readonly listenerService: EventEmitterService,
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
        ? new ConflictException(USER_MESSAGES_ERRORS.USER_CONFLICT)
        : err;
    });

    this.listenerService.emit(USER_LISTENER.USER_CREATE, {
      document: createdUser,
    });
  }

  async findById(id: string): Promise<UserEntity> {
    const docResult = await this.userModel
      .findOne({ _id: id, ...this.onlyActives })
      .lean();

    if (!docResult) {
      throw new NotFoundException(USER_MESSAGES_ERRORS.USER_DOES_NOT_EXIST);
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
    const query = MongoHelper.formatSimpleQuery({
      baseKey: 'data.profile',
      iterationObject: profile,
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

    if (docResult) {
      this.listenerService.emit(USER_LISTENER.USER_PROFILE_UPDATE, {
        document: docResult,
        profile: docResult.data.profile,
      });
    }

    return UserEntity.fromDbToEntity(docResult).profile;
  }

  async createAddress(
    userId: string,
    { id: addressId, ...address }: AddressProps,
  ): Promise<AddressProps[]> {
    const docResult = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            'data.address': { _id: addressId, ...address },
          },
        },
        {
          new: true,
        },
      )
      .lean();

    if (docResult) {
      this.listenerService.emit(USER_LISTENER.ADDRESS_CREATE, {
        document: docResult,
        newAddress: docResult.data.address.find(
          (addressItem) => addressItem._id.toString() === addressId,
        ),
      });
    }

    return UserEntity.fromDbToEntity(docResult).address;
  }

  async updateAddress(
    userId: string,
    {
      addressId,
      ...address
    }: { addressId: string } & Partial<Omit<AddressProps, 'id'>>,
  ): Promise<AddressProps> {
    const query = MongoHelper.formatSimpleQuery({
      baseKey: 'data.address.$[item]',
      iterationObject: address,
    });

    const docResult = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          'data.address._id': addressId,
        },
        {
          $set: {
            ...query,
          },
        },
        {
          arrayFilters: [{ 'item._id': addressId }],
          new: true,
        },
      )
      .lean();

    if (docResult) {
      this.listenerService.emit(USER_LISTENER.ADDRESS_UPDATE, {
        document: docResult,
        address: docResult.data.address.find(
          (addressItem) => addressItem._id.toString() === addressId,
        ),
      });
    }

    return UserEntity.fromDbToEntity(docResult).address.find(
      ({ id }) => id === addressId,
    );
  }

  async deleteAddress(
    userId: string,
    { addressId }: { addressId: string },
  ): Promise<AddressProps[]> {
    const docResult = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $pull: {
            'data.address': { _id: addressId },
          },
        },
        {
          new: true,
        },
      )
      .lean();

    if (docResult) {
      this.listenerService.emit(USER_LISTENER.ADDRESS_DELETE, {
        document: docResult,
        address: docResult.data.address,
      });
    }

    return UserEntity.fromDbToEntity(docResult).address;
  }
}
