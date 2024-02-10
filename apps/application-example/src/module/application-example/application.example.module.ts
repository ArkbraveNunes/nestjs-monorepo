import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { COLLECTION } from '@common/enum';
import { userSchema } from '@applicationExample/infra/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION.USER,
        schema: userSchema,
        collection: COLLECTION.USER,
      },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class ApplicationExampleModule {}
