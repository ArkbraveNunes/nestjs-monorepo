import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { COLLECTION, REPOSITORY } from '@common/enum';
import { HistoryCreateService } from '@history/domain/service';
import { HistoryRepository } from '@history/infra/repository';
import { historySchema } from '@history/infra/schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION.HISTORY,
        schema: historySchema,
        collection: COLLECTION.HISTORY,
      },
    ]),
  ],
  controllers: [],
  providers: [
    HistoryCreateService,
    {
      provide: REPOSITORY.HISTORY_REPOSITORY,
      useClass: HistoryRepository,
    },
  ],
  exports: [
    MongooseModule,
    HistoryCreateService,
    {
      provide: REPOSITORY.HISTORY_REPOSITORY,
      useClass: HistoryRepository,
    },
  ],
})
export class HistoryModule {}
