import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  AddressCreateListenerInput,
  UserCreateListenerInput,
  AddressDeleteListenerInput,
  AddressUpdateListenerInput,
  ProfileUpdateListenerInput,
} from '@common/listeners';
import { LoggerService } from '@libs/logger';
import { HistoryCreateService } from '@history/domain/service';
import { HISTORY_ACTION, HISTORY_TYPE, USER_LISTENER } from '@common/enum';

@Injectable()
export class UserListener {
  constructor(
    private readonly historyCreateService: HistoryCreateService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(UserListener.name);
  }

  @OnEvent(USER_LISTENER.USER_CREATE, { async: true })
  async userCreate({ document }: UserCreateListenerInput): Promise<void> {
    await this.loggerService.debug(
      `Listener ${USER_LISTENER.USER_CREATE} executed`,
    );
    const action = HISTORY_ACTION.CREATE;

    await this.historyCreateService.execute({
      action,
      user: document,
      fieldUpdated: {
        type: HISTORY_TYPE.USER,
        value: document,
      },
    });
  }

  @OnEvent(USER_LISTENER.ADDRESS_CREATE, { async: true })
  async addressCreate({
    document,
    newAddress,
  }: AddressCreateListenerInput): Promise<void> {
    await this.loggerService.debug(
      `Listener ${USER_LISTENER.ADDRESS_CREATE} executed`,
    );
    const action = HISTORY_ACTION.CREATE;

    await this.historyCreateService.execute({
      action,
      user: document,
      fieldUpdated: {
        type: HISTORY_TYPE.ADDRESS,
        value: newAddress,
      },
    });
  }

  @OnEvent(USER_LISTENER.USER_PROFILE_UPDATE, { async: true })
  async userProfileUpdate({
    document,
    profile,
  }: ProfileUpdateListenerInput): Promise<void> {
    await this.loggerService.debug(
      `Listener ${USER_LISTENER.USER_PROFILE_UPDATE} executed`,
    );
    const action = HISTORY_ACTION.UPDATE;

    await this.historyCreateService.execute({
      action,
      user: document,
      fieldUpdated: {
        type: HISTORY_TYPE.PROFILE,
        value: profile,
      },
    });
  }

  @OnEvent(USER_LISTENER.ADDRESS_UPDATE, { async: true })
  async addressUpdate({
    document,
    address,
  }: AddressUpdateListenerInput): Promise<void> {
    await this.loggerService.debug(
      `Listener ${USER_LISTENER.ADDRESS_UPDATE} executed`,
    );
    const action = HISTORY_ACTION.UPDATE;

    await this.historyCreateService.execute({
      action,
      user: document,
      fieldUpdated: {
        type: HISTORY_TYPE.ADDRESS,
        value: address,
      },
    });
  }

  @OnEvent(USER_LISTENER.ADDRESS_DELETE, { async: true })
  async addressDelete({
    document,
    address,
  }: AddressDeleteListenerInput): Promise<void> {
    await this.loggerService.debug(
      `Listener ${USER_LISTENER.ADDRESS_DELETE} executed`,
    );
    const action = HISTORY_ACTION.DELETE;

    await this.historyCreateService.execute({
      action,
      user: document,
      fieldUpdated: {
        type: HISTORY_TYPE.ADDRESS,
        value: address,
      },
    });
  }
}
