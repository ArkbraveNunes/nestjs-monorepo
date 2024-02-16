import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { HistoryRepository } from '@history/infra/repository';
import { historySchema, HistorySchema } from '@history/infra/schema';
import { mockedHistoryEntity } from '@test/mock';

describe('HistoryRepository', () => {
  let historyRepository: HistoryRepository;
  let inMemoryMongoServer: MongoMemoryServer;
  let mockedHistoryModel: mongoose.Model<HistorySchema>;
  let mongoConnection: mongoose.Connection;
  let expectedMongoError: Error;

  beforeAll(async () => {
    inMemoryMongoServer = await MongoMemoryServer.create();
    mongoConnection = (await mongoose.connect(inMemoryMongoServer.getUri()))
      .connection;
    mockedHistoryModel = mongoConnection.model(
      HistorySchema.name,
      historySchema,
    );

    expectedMongoError = new Error('mongo-error');
  });

  beforeEach(async () => {
    historyRepository = new HistoryRepository(mockedHistoryModel);
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
    it('should call create - success - create history', async () => {
      await historyRepository.create(mockedHistoryEntity);

      const savedHistory = await mockedHistoryModel.findOne({
        _id: mockedHistoryEntity.id,
      });

      expect(savedHistory.id).toBe(mockedHistoryEntity.id);
    });
  });

  describe('findById()', () => {
    it('should call findById - success - return history', async () => {
      await historyRepository.create(mockedHistoryEntity);

      const savedHistory = await historyRepository.findById(
        mockedHistoryEntity.userId,
      );

      expect(savedHistory.userId).toEqual(mockedHistoryEntity.userId);
    });

    it('should call findById - database error', async () => {
      jest.spyOn(mockedHistoryModel, 'find').mockReturnValueOnce({
        sort: () => ({
          limit: () => ({
            lean: jest.fn().mockRejectedValueOnce(expectedMongoError),
          }),
        }),
      } as any);

      await historyRepository
        .findById(mockedHistoryEntity.id)
        .catch((actualError) => {
          expect(actualError).toBe(expectedMongoError);
        });
    });
  });
});
