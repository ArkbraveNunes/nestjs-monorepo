import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { COLLECTION, REPOSITORY } from '@common/enum';
import { userSchema } from '@user/infra/schema';
import { UserCreateController } from '@user/application/controller';
import { UserCreateService } from '@user/domain/service';
import { MongoUserRepository } from '@user/infra/repository';

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
  controllers: [UserCreateController],
  providers: [
    UserCreateService,
    { provide: REPOSITORY.USER_REPOSITORY, useClass: MongoUserRepository },
  ],
  exports: [MongooseModule],
})
export class ApplicationExampleModule {}
