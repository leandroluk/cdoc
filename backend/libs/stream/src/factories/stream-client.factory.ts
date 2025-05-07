import {type FactoryProvider} from '@nestjs/common';
import Redis from 'ioredis';
import {LoggerService} from 'libs/logger';
import {StreamEnv} from '../stream.env';

export const streamClientFactory: FactoryProvider<Redis> = {
  provide: Redis,
  durable: true,
  inject: [StreamEnv],
  async useFactory(streamEnv: StreamEnv) {
    const loggerService = new LoggerService('StreamModule.streamClientFactory');
    try {
      const client = new Redis(streamEnv.connectionString, {lazyConnect: true});
      await client.connect();
      return client;
    } catch (error) {
      loggerService.log('Failed to connect', error);
      throw error;
    }
  },
};
