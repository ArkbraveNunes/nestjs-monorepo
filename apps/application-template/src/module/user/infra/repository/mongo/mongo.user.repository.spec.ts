import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { mockedUserEntity, mockedAddressEntity } from '@test/mock';
import { userSchema, UserSchema } from '@user/infra/schema';
import { MESSAGES_ERRORS, USER_GENDER } from '@common/enum';
import { MongoUserRepository } from '@user/infra/repository';
import { AddressEntity } from '@user/domain/entity';

describe('MongoUserRepository', () => {
  let mongoUserRepository: MongoUserRepository;
  let inMemoryMongoServer: MongoMemoryServer;
  let mockedUserModel: mongoose.Model<UserSchema>;
  let mongoConnection: mongoose.Connection;
  let expectedMongoError: InternalServerErrorException;

  beforeAll(async () => {
    inMemoryMongoServer = await MongoMemoryServer.create();
    mongoConnection = (await mongoose.connect(inMemoryMongoServer.getUri()))
      .connection;
    mockedUserModel = mongoConnection.model(UserSchema.name, userSchema);

    expectedMongoError = new InternalServerErrorException(
      MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
    );
  });

  beforeEach(async () => {
    mongoUserRepository = new MongoUserRepository(mockedUserModel);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await inMemoryMongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create()', () => {
    it('should call create - success - create user', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const savedUser = await mockedUserModel.findOne({
        _id: mockedUserEntity.id,
      });

      expect(savedUser.id).toBe(mockedUserEntity.id);
    });

    it('should call create - error - user already exist', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      await mongoUserRepository
        .create(mockedUserEntity)
        .catch((error) => {
          expect(error).toBeInstanceOf(ConflictException);
        })
        .then((result) => expect(result).toBe(undefined));
    });
  });

  describe('findById()', () => {
    it('should call findById - success - return user', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const actualUser = await mongoUserRepository.findById(
        mockedUserEntity.id,
      );

      expect(actualUser.id).toEqual(mockedUserEntity.id);
    });

    it('should call findById - error - user not found', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      await mongoUserRepository
        .findById(faker.database.mongodbObjectId().toString())
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
        })
        .then((result) => expect(result).toBe(undefined));
    });

    it('should call findById - error - database error', async () => {
      jest.spyOn(mockedUserModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .findById(mockedUserEntity.id)
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        })
        .then((result) => expect(result).toBe(undefined));
    });
  });

  describe('findByEmail()', () => {
    it('should call findByEmail - success - return user', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const actualUser = await mongoUserRepository.findByEmail({
        email: mockedUserEntity.profile.email,
      });

      expect(actualUser.profile.email).toEqual(mockedUserEntity.profile.email);
    });

    it('should call findByEmail - success - return null', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const actualUser = await mongoUserRepository.findByEmail({
        email: faker.internet.email(),
      });

      expect(actualUser).toEqual(null);
    });

    it('should call findByEmail - error - database error', async () => {
      jest.spyOn(mockedUserModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .findByEmail({
          email: mockedUserEntity.profile.email,
        })
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        })
        .then((result) => expect(result).toBe(undefined));
    });
  });

  describe('updateUserProfile()', () => {
    it('should call updateUserProfile - success - return profile', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const actualUser = await mongoUserRepository.updateUserProfile(
        mockedUserEntity.id,
        {
          gender: USER_GENDER.NON_BINARY,
        },
      );

      expect(actualUser).toEqual({
        ...mockedUserEntity.profile,
        gender: USER_GENDER.NON_BINARY,
      });
    });

    it('should call updateUserProfile - error - database error', async () => {
      jest.spyOn(mockedUserModel, 'findOneAndUpdate').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .updateUserProfile(mockedUserEntity.id, {
          gender: USER_GENDER.NON_BINARY,
        })
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });

  describe('createAddress()', () => {
    it('should call createAddress - success - return address list', async () => {
      await mongoUserRepository.create({
        ...mockedUserEntity,
        address: [],
      });

      const actualAddressList = await mongoUserRepository.createAddress(
        mockedUserEntity.id,
        mockedAddressEntity(),
      );

      expect(actualAddressList.length > 0).toBe(true);
    });

    it('should call createAddress - return database error', async () => {
      jest.spyOn(mockedUserModel, 'findOneAndUpdate').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .createAddress(mockedUserEntity.id, mockedAddressEntity())
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });

  describe('updateAddress()', () => {
    it('should call updateAddress - success - return address updated', async () => {
      const address: Partial<AddressEntity> = {
        id: mockedUserEntity.address[0].id,
        number: faker.number.int().toString(),
      };

      await mongoUserRepository.create({
        ...mockedUserEntity,
      });

      const actualAddress = await mongoUserRepository.updateAddress(
        mockedUserEntity.id,
        { addressId: address.id, ...address },
      );

      Object.keys(address).forEach((propertyUpdated) => {
        expect(
          address[propertyUpdated] === actualAddress[propertyUpdated],
        ).toBe(true);
      });
    });

    it('should call updateAddress - return database error', async () => {
      jest.spyOn(mockedUserModel, 'findOneAndUpdate').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      const addressDataUpdated: Partial<Omit<AddressEntity, 'id'>> = {
        number: faker.number.int().toString(),
      };
      const address = mockedAddressEntity();

      await mongoUserRepository.create({
        ...mockedUserEntity,
        address: [address],
      });

      await mongoUserRepository
        .updateAddress(mockedUserEntity.id, {
          addressId: address.id,
          ...addressDataUpdated,
        })
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });

  describe('deleteAddress()', () => {
    it('should call deleteAddress - success - return address list without address deleted', async () => {
      const addressDeleted = mockedAddressEntity();

      await mongoUserRepository.create({
        ...mockedUserEntity,
        address: [mockedAddressEntity(), addressDeleted],
      });

      const actualAddress = await mongoUserRepository.deleteAddress(
        mockedUserEntity.id,
        { addressId: addressDeleted.id },
      );

      expect(
        actualAddress.map(({ id }) => id).includes(addressDeleted.id),
      ).toBeFalsy();
    });

    it('should call deleteAddress - return database error', async () => {
      jest.spyOn(mockedUserModel, 'findOneAndUpdate').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .deleteAddress(mockedUserEntity.id, {
          addressId: mockedAddressEntity().id,
        })
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });
});
