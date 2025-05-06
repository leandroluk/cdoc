import {type FactoryProvider} from '@nestjs/common';
import Redis from 'ioredis';
import {LoggerService} from 'libs/logger';
import {CacheEnv} from '../cache.env';

export const cacheClientFactory: FactoryProvider<Redis> = {
  provide: Redis,
  durable: true,
  inject: [CacheEnv],
  async useFactory(cacheEnv: CacheEnv) {
    const loggerService = new LoggerService('CacheModule.cacheClientFactory');
    try {
      const client = new Redis(cacheEnv.connectionString, {lazyConnect: true});
      await client.connect();
      loggerService.log('Connected.');
      return client;
    } catch (error) {
      this.loggerService.log('Failed to connect', error);
      throw error;
    }
  },
};
