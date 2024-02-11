import { CreateRepository, FindByIdRepository } from '@libs/contract';
import { UserEntity } from '@user/domain/entity';

export interface UserRepositoryContract
  extends CreateRepository<UserEntity>,
    FindByIdRepository<UserEntity> {}
