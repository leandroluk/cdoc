import {Injectable} from '@nestjs/common';
import Redis from 'ioredis';
import {LoggerService} from 'libs/logger';
import {CacheEnv} from './cache.env';

@Injectable()
export class CacheService {
  constructor(
    private readonly cacheEnv: CacheEnv,
    private readonly client: Redis,
    private readonly loggerService: LoggerService
  ) {}

  async ping(): Promise<void> {
    try {
      await this.client.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const stringfiedValue = await this.client.get(`${this.cacheEnv.prefix}:${key}`);
      if (stringfiedValue) {
        const value = JSON.parse(stringfiedValue);
        return value;
      }
    } catch {
      // no need catch
    }
    return null;
  }

  async set<T = unknown>(key: string, value: T, expiresInSeconds?: number): Promise<void> {
    const ref = `${this.cacheEnv.prefix}:${key}`;
    const stringfiedValue = JSON.stringify(value);
    let multi = this.client.multi().set(ref, stringfiedValue);
    if (expiresInSeconds) {
      multi = multi.expire(ref, expiresInSeconds);
    }
    await multi.exec();
  }

  async del(key: string): Promise<void> {
    await this.client.del(`${this.cacheEnv.prefix}:${key}`);
  }

  async has(key: string): Promise<boolean> {
    return Boolean(await this.client.exists(key));
  }
}
