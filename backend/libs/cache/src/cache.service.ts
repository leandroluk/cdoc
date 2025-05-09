import {Injectable} from '@nestjs/common';
import Redis from 'ioredis';
import {LoggerService} from 'libs/logger';
import {CacheEnv} from './cache.env';

@Injectable()
export class CacheService {
  constructor(
    private readonly cacheEnv: CacheEnv,
    private readonly cacheClient: Redis,
    private readonly loggerService: LoggerService
  ) {}

  async ping(): Promise<void> {
    try {
      await this.cacheClient.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  async get<T = unknown>(pattern: string): Promise<T | null> {
    try {
      const [key] = await this.cacheClient.keys(`${this.cacheEnv.prefix}:${pattern}`);
      const stringfiedValue = await this.cacheClient.get(key);
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
    let multi = this.cacheClient.multi().set(ref, stringfiedValue);
    if (expiresInSeconds) {
      multi = multi.expire(ref, expiresInSeconds);
    }
    await multi.exec();
  }

  async del(key: string): Promise<void> {
    await this.cacheClient.del(`${this.cacheEnv.prefix}:${key}`);
  }

  async has(key: string): Promise<boolean> {
    return Boolean(await this.cacheClient.exists(key));
  }

  async refresh(key: string, expiresInSeconds: number): Promise<void> {
    await this.cacheClient.expire(key, expiresInSeconds);
  }
}
