import {Module, type Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import * as storageProviders from './storage-providers';
import {StorageEnv} from './storage.env';
import {StorageLifecycle} from './storage.lifecycle';
import {StorageProviderBus} from './storage.provider-bus';

const providers = Array<Provider>().concat(
  Object.values(storageProviders), //
  StorageEnv,
  StorageProviderBus,
  StorageLifecycle
);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class StorageModule {}
