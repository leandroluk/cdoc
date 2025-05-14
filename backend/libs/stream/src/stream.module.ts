import {Module, type Provider} from '@nestjs/common';
import {DiscoveryModule} from '@nestjs/core';
import {LoggerModule} from 'libs/logger';

import {StreamEnv} from './stream.env';
import {StreamService} from './stream.service';

const providers = Array<Provider>().concat(StreamEnv, StreamService);

@Module({
  imports: [DiscoveryModule, LoggerModule],
  providers,
  exports: providers,
})
export class StreamModule {}
