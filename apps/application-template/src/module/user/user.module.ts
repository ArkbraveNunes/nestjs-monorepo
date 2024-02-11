import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserCreateController,
  UserUpdateController,
} from '@user/application/controller';
import { userSchema } from '@user/infra/schema';
import { COLLECTION, REPOSITORY } from '@common/enum';
import { MongoUserRepository } from '@user/infra/repository';
import { UserCreateService, UserUpdateService } from '@user/domain/service';

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
  controllers: [UserCreateController, UserUpdateController],
  providers: [
    UserCreateService,
    UserUpdateService,
    { provide: REPOSITORY.USER_REPOSITORY, useClass: MongoUserRepository },
  ],
  exports: [
    MongooseModule,
    { provide: REPOSITORY.USER_REPOSITORY, useClass: MongoUserRepository },
  ],
})
export class UserModule {}
