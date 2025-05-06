import {Module, type Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import {CacheEnv} from './cache.env';
import {CacheService} from './cache.service';
import * as factories from './factories';
import * as interceptors from './interceptors';

const providers = Array<Provider>().concat(
  CacheEnv, //
  CacheService,
  Object.values(factories),
  Object.values(interceptors)
);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class CacheModule {}
