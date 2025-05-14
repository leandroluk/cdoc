import {Module, Provider} from '@nestjs/common';
import {DatabaseModule} from 'libs/database';
import {LoggerModule} from 'libs/logger';
import {QueueModule} from 'libs/queue';
import {StorageModule} from 'libs/storage';
import * as workers from './workers';

const providers = Array<Provider>().concat(Object.values(workers));

@Module({
  imports: [LoggerModule, StorageModule, QueueModule, DatabaseModule],
  providers,
})
export class ImporterModule {}
