import {Module, Provider} from '@nestjs/common';
import {DatabaseModule} from 'libs/database';
import {LoggerModule} from 'libs/logger';
import {QueueModule} from 'libs/queue';
import {StorageModule} from 'libs/storage';
import {ImporterLifecycle} from './importer.lifecycle';
import * as services from './services';

const providers = Array<Provider>().concat(Object.values(services), ImporterLifecycle);

@Module({
  imports: [LoggerModule, StorageModule, QueueModule, DatabaseModule],
  providers,
})
export class ImporterModule {}
