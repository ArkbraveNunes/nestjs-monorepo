import { Inject, Injectable } from '@nestjs/common';

import {
  UserCreateServiceInputDto,
  UserCreateServiceOutputDto,
} from '@applicationExample/domain/service';
import { UserRepositoryContract } from '@applicationExample/domain/contract';
import { MESSAGES_SUCCESS, REPOSITORY } from '@common/enum';
import { UserEntity } from '@applicationExample/domain/entity';
import { CryptographDataService } from '@libs/cryptograph-data';

Injectable();
export class UserCreateService {
  constructor(
    @Inject(REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
    private readonly cryptographDataService: CryptographDataService,
  ) {}

  async execute({
    address,
    password,
    ...profile
  }: UserCreateServiceInputDto): Promise<UserCreateServiceOutputDto> {
    const passwordEncrypted =
      await this.cryptographDataService.encryptData(password);

    const userEntity = UserEntity.create({
      profile: { ...profile, password: passwordEncrypted },
      address: [address],
    });

    await this.userRepository.create(userEntity);

    return {
      id: userEntity.id,
      message: [MESSAGES_SUCCESS.USER_CREATED_WITH_SUCCESS],
    };
  }
}
