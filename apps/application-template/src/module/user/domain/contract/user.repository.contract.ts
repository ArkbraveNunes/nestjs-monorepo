import { CreateRepository, FindByIdRepository } from '@libs/contract';
import { ProfileProps, UserEntity } from '@user/domain/entity';

export interface UserRepositoryContract
  extends CreateRepository<UserEntity>,
    FindByIdRepository<UserEntity> {
  findByEmail({ email }: Pick<ProfileProps, 'email'>): Promise<UserEntity>;
}
