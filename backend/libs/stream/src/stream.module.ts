import {Module, type Provider} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {LoggerModule} from 'libs/logger';

import {StreamEnv} from './stream.env';
import {StreamLifecycle} from './stream.lifecycle';
import {StreamService} from './stream.service';

const providers = Array<Provider>().concat(StreamEnv, StreamService, StreamLifecycle);

@Module({
  imports: [DiscoveryModule, LoggerModule],
  providers,
  exports: providers,
})
export class StreamModule {}
