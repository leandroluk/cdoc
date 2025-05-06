import {Module, type Provider} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {LoggerModule} from 'libs/logger';
import * as factories from './factories';
import {StreamEnv} from './stream.env';
import {StreamService} from './stream.service';
import {StreamSubscribeExplorer} from './stream.subscribe-explorer';

const providers = Array<Provider>().concat(
  Object.values(factories), //
  StreamEnv,
  StreamService,
  StreamSubscribeExplorer
);

@Module({
  imports: [DiscoveryModule, LoggerModule],
  providers,
  exports: providers,
})
export class StreamModule {}
