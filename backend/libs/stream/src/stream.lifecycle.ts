import {Injectable, OnApplicationBootstrap, OnModuleInit} from '@nestjs/common';
import {LoggerService} from 'libs/logger';
import {StreamService} from './stream.service';

@Injectable()
export class StreamLifecycle implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly streamService: StreamService,
    private readonly loggerService: LoggerService
  ) {}

  async onModuleInit(): Promise<void> {
    await this.streamService.connect();
  }

  async onApplicationBootstrap(): Promise<void> {
    this.streamService.explore().catch((error: Error) => this.loggerService.error(error));
  }
}
