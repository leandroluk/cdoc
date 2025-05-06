import {Injectable} from '@nestjs/common';
import {Redis} from 'ioredis';
import {LoggerService} from 'libs/logger';
import {AbstractEvent} from './events';

@Injectable()
export class StreamService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly streamClient: Redis
  ) {}

  async ping(): Promise<void> {
    try {
      await this.streamClient.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async publish<T extends AbstractEvent>(event: T): Promise<void> {
    const topic = event.constructor.name;
    const payload = JSON.stringify(event);

    try {
      await this.streamClient.publish(topic, payload);
    } catch (error) {
      this.loggerService.error(`Failed to publish event ${topic}`, error);
      throw error;
    }
  }
}
