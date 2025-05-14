import {Module, Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import * as queueProviders from './queue-providers';
import {QueueEnv} from './queue.env';
import {QueueProviderBus} from './queue.provider-bus';

const providers = Array<Provider>().concat(QueueEnv, QueueProviderBus, Object.values(queueProviders));

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class QueueModule {}
