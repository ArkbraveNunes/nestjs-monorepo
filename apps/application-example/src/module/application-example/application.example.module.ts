import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { COLLECTION, REPOSITORY } from '@common/enum';
import { userSchema } from '@applicationExample/infra/schema';
import { UserCreateController } from '@applicationExample/application/controller';
import { UserCreateService } from '@applicationExample/domain/service';
import { MongoUserRepository } from '@applicationExample/infra/repository';

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
