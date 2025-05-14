import {Module, Provider} from '@nestjs/common';
import {CommonModule} from 'libs/common';
import {DatabaseModule} from 'libs/database';
import {LoggerModule} from 'libs/logger';
import {StorageModule} from 'libs/storage';
import * as services from './services';
import {SystemController} from './system.controller';

@Module({
  imports: [
    // internal imports
    CommonModule,
    LoggerModule,
    StorageModule,
    DatabaseModule,
  ],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [SystemController],
})
export class SystemModule {}
