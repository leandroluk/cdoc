import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {DiscoveryService, MetadataScanner, Reflector} from '@nestjs/core';
import {Redis} from 'ioredis';
import {LoggerService} from 'libs/logger';
import {AbstractEvent} from './events';
import {STREAM_SUBSCRIBE_EVENT_METADATA_KEY} from './stream.constants';

@Injectable()
export class StreamSubscribeExplorer implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
    private readonly loggerService: LoggerService,
    private readonly streamClient: Redis
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.explore().catch(console.error);
  }

  private async explore(): Promise<void> {
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

        await this.streamClient.subscribe(topic);

        this.streamClient.on('message', (channel, message) => {
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
