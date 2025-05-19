import {Injectable, OnModuleInit} from '@nestjs/common';
import {StorageProviderBus} from './storage.provider-bus';

@Injectable()
export class StorageLifecycle implements OnModuleInit {
  constructor(private readonly storageProviderBus: StorageProviderBus) {}

  async onModuleInit(): Promise<void> {
    await this.storageProviderBus.connect();
  }
}
