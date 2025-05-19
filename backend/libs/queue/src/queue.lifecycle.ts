import {Injectable, OnModuleInit} from '@nestjs/common';
import {QueueProviderBus} from './queue.provider-bus';

@Injectable()
export class QueueLifecycle implements OnModuleInit {
  constructor(private readonly queueProviderBus: QueueProviderBus) {}

  async onModuleInit(): Promise<void> {
    await this.queueProviderBus.connect();
  }
}
