import {Module, type Provider} from '@nestjs/common';
import * as storageProviders from './storage-providers';
import {StorageEnv} from './storage.env';
import {StorageService} from './storage.service';

const providers = Array<Provider>().concat(
  Object.values(storageProviders), //
  StorageEnv,
  StorageService
);

@Module({
  providers,
  exports: providers,
})
export class StorageModule {}
