import { CreateRepository, FindByIdRepository } from '@libs/contract';
import { HistoryEntity } from '@history/domain/entity';

export interface HistoryRepositoryContract
  extends CreateRepository<HistoryEntity>,
    FindByIdRepository<HistoryEntity> {}
