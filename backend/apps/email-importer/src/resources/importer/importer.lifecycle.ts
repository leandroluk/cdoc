import {Injectable, type OnApplicationBootstrap} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {EmailService} from './services';

@Injectable()
export class ImporterLifecycle implements OnApplicationBootstrap {
  constructor(
    private readonly emailService: EmailService,
    private readonly loggerService: LoggerService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.emailService.run().catch((error: Error) => this.loggerService.error(error));
  }
}
