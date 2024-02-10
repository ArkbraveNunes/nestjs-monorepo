import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  ConflictException,
  //InternalServerErrorException,
} from '@nestjs/common';
//import { MockProxy, mock } from 'jest-mock-extended';

import { MongoUserRepository } from '@applicationExample/infra/repository';
import { userSchema, UserSchema } from '@applicationExample/infra/schema';
import { mockedUserEntity } from '@test/mock';
//import { MESSAGES_ERRORS } from '@common/enum';

describe('MongoUserRepository', () => {
  let mongoUserRepository: MongoUserRepository;
  let inMemoryMongoServer: MongoMemoryServer;
  let mockedUserModel: mongoose.Model<UserSchema>;
  let mongoConnection: mongoose.Connection;
  //let expectedMongoError: InternalServerErrorException;

  beforeAll(async () => {
    inMemoryMongoServer = await MongoMemoryServer.create();
    mongoConnection = (await mongoose.connect(inMemoryMongoServer.getUri()))
      .connection;
    mockedUserModel = mongoConnection.model(UserSchema.name, userSchema);

    /*expectedMongoError = new InternalServerErrorException(
      MESSAGES_ERRORS.INTERNAL_SERVER_ERROR,
    );*/
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

  describe('save()', () => {
    it('should save the User correctly', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      const savedUser = await mockedUserModel.findOne({
        _id: mockedUserEntity.id,
      });

      expect(savedUser.id).toBe(mockedUserEntity.id);
    });

    it('should throw a ConflictException if email, phoneNumber or document already exists on database', async () => {
      await mongoUserRepository.create(mockedUserEntity);

      await mongoUserRepository
        .create(mockedUserEntity)
        .catch((error) => {
          expect(error).toBeInstanceOf(ConflictException);
        })
        .then((result) => expect(result).toBe(undefined));
    });
  });

  /*describe('findById()', () => {
    it('should call findById - return success', async () => {
      await mongoUserRepository.save(mockedUserEntity);

      const actualUser = await mongoUserRepository.findById(
        mockedUserEntity.id,
      );

      expect(actualUser.id).toEqual(mockedUserEntity.id);
    });

    it('should call findById - database error', async () => {
      jest.spyOn(mockedUserModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
      } as any);

      await mongoUserRepository
        .findById(mockedUserEntity.id)
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });*/
});
