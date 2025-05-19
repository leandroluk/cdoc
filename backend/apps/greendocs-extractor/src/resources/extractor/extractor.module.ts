import {Module, Provider} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {CommonModule} from 'libs/common';
import {DatabaseModule} from 'libs/database';
import {LoggerModule} from 'libs/logger';
import {ExtractorEnv} from './extractor.env';
import {ExtractorLifecycle} from './extractor.lifecycle';
import {ExtractorOrchestrator} from './extractor.orchestrator';
import * as factories from './factories';
import * as workers from './services';

@Module({
  imports: [
    // external imports
    ScheduleModule.forRoot(),
    // internal imports
    CommonModule,
    DatabaseModule,
    LoggerModule,
  ],
  providers: Array<Provider>().concat(
    ExtractorEnv,
    ExtractorOrchestrator,
    ExtractorLifecycle,
    Object.values(factories),
    Object.values(workers)
  ),
})
export class ExtractorModule {}
