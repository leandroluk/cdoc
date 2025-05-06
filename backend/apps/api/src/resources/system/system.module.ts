import {Module, Provider} from '@nestjs/common';
import {CommonModule} from 'libs/common';
import {LoggerModule} from 'libs/logger';
import * as services from './services';
import {SystemController} from './system.controller';

@Module({
  imports: [
    // internal imports
    CommonModule,
    LoggerModule,
  ],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [SystemController],
})
export class SystemModule {}
