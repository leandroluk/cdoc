import {Injectable} from '@nestjs/common';
import {DiscoveryService, MetadataScanner, Reflector} from '@nestjs/core';
import {Redis} from 'ioredis';
import {LoggerService} from 'libs/logger';
import {AbstractEvent} from './events';
import {STREAM_SUBSCRIBE_EVENT_METADATA_KEY} from './stream.constants';
import {StreamEnv} from './stream.env';

@Injectable()
export class StreamService {
  readonly client: Redis;
  readonly subscriber: Redis;

  constructor(
    streamEnv: StreamEnv,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
    private readonly loggerService: LoggerService
  ) {
    this.client = new Redis(streamEnv.connectionString, {lazyConnect: true});
    this.subscriber = this.client.duplicate({autoResubscribe: true, reconnectOnError: () => true});
  }

  async connect(): Promise<void> {
    try {
      await Promise.all([this.client.connect(), this.subscriber.connect()]);
    } catch (error) {
      this.loggerService.error(`Failed to connect ${this.constructor.name}.`, error);
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

  async publish<T extends AbstractEvent>(event: T): Promise<void> {
    const topic = event.constructor.name;
    const payload = JSON.stringify(event);

    try {
      await this.client.publish(topic, payload);
    } catch (error) {
      this.loggerService.error(`Failed to publish event ${topic}`, error);
      throw error;
    }
  }

  async explore(): Promise<void> {
    const instanceWrappers = this.discoveryService.getProviders();

    for (const {instance} of instanceWrappers) {
      if (!instance || typeof instance !== 'object') {
        continue;
      }

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methodNames) {
        const method = prototype[methodName];
        const metadata = this.reflector.get<{
          eventClass: new (...args: any[]) => AbstractEvent;
        }>(STREAM_SUBSCRIBE_EVENT_METADATA_KEY, method);

        if (!metadata) {
          continue;
        }

        const {eventClass} = metadata;
        const topic = eventClass.name;

        await this.subscriber.subscribe(topic);

        this.subscriber.on('message', (channel, message) => {
          if (channel !== topic) {
            return;
          }

          void (async (): Promise<void> => {
            try {
              const parsed = JSON.parse(message);
              const event = new eventClass(parsed.payload, new Date(parsed.timestamp));
              await method.call(instance, event);
            } catch (error) {
              this.loggerService.error(`Failed to process event ${eventClass.name}`, error);
            }
          })();
        });

        this.loggerService.log(`${eventClass.name} was subscribed by ${instance.constructor.name}`);
      }
    }
  }
}
