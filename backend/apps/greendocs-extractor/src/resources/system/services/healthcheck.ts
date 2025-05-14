import {ServerError, THealthcheck} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService} from 'libs/database';
import ms from 'ms';

@Injectable()
export class Healthcheck implements THealthcheck {
  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<THealthcheck.Result> {
    try {
      await this.databaseService.ping();
      return {uptime: ms(process.uptime() * 1000)};
    } catch (error) {
      throw new ServerError(error.message);
    }
  }
}
