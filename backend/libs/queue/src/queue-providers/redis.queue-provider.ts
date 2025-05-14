import Redis from 'ioredis';
import {LoggerService} from 'libs/logger';
import {QueueProvider} from '../decorators';
import {QueueEnv} from '../queue.env';
import {EQueueProvider, TQueueProvider} from '../queue.types';

@QueueProvider(EQueueProvider.Redis)
export class RedisQueueProvider implements TQueueProvider {
  private readonly client: Redis;
  private readonly queueKey = 'queue';

  constructor(
    private readonly queueEnv: QueueEnv,
    private readonly loggerService: LoggerService
  ) {
    this.client = new Redis(this.queueEnv.redisConnectionString, {lazyConnect: true});
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.loggerService.error(`Failed to init ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.client.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async enqueue<T = unknown>(queueName: string, payload: T): Promise<void> {
    const stringified = JSON.stringify(payload);
    await this.client.lpush(`${this.queueKey}:${queueName}`, stringified);
  }

  async subscribe<T = unknown>(
    queueName: string,
    consumeFn: (payload: T) => Promise<void>
  ): Promise<{unsubscribe: () => boolean}> {
    let shouldConsume = true;
    while (shouldConsume) {
      try {
        const result = await this.client.brpop(`${this.queueKey}:${queueName}`, 0);
        if (!result) {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        const [, raw] = result;
        try {
          const payload: T = JSON.parse(raw);
          try {
            await consumeFn(payload);
          } catch {
            this.loggerService.error(`Failed to consume message: ${raw}`);
            await this.enqueue(queueName, payload);
          }
        } catch {
          this.loggerService.warn(`Invalid queue message: ${raw}`);
        }
      } catch {
        break;
      }
    }
    return {unsubscribe: () => (shouldConsume = false)};
  }
}
