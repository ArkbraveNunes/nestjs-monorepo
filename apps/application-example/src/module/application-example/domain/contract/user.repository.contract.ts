import { CreateRepository } from '@libs/contract';
import { UserEntity } from '@applicationExample/domain/entity';

export interface UserRepositoryContract extends CreateRepository<UserEntity> {}
