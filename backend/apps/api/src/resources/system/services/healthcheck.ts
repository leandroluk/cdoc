import {ServerError, type THealthcheck} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService} from 'libs/database';
import {StorageProviderBus} from 'libs/storage';
import ms from 'ms';

@Injectable()
export class Healthcheck implements THealthcheck {
  constructor(
    private readonly storageProviderBus: StorageProviderBus,
    private readonly databaseService: DatabaseService
  ) {}
  async run(): Promise<THealthcheck.Result> {
    try {
      await Promise.all([this.storageProviderBus.ping(), this.databaseService.ping()]);
      return {uptime: ms(process.uptime() * 1000)};
    } catch (error) {
      throw new ServerError(error.message);
    }
  }
}
