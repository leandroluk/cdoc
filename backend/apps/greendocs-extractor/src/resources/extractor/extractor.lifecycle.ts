import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {ExtractorOrchestrator} from './extractor.orchestrator';

@Injectable()
export class ExtractorLifecycle implements OnApplicationBootstrap {
  constructor(
    private readonly extractorOrchestrator: ExtractorOrchestrator,
    protected readonly loggerService: LoggerService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.extractorOrchestrator.run().catch((error: Error) => this.loggerService.error(error));
  }
}
