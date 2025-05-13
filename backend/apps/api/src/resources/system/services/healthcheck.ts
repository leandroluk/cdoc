import {ServerError, type THealthcheck} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import ms from 'ms';

@Injectable()
export class Healthcheck implements THealthcheck {
  async run(): Promise<THealthcheck.Result> {
    try {
      return {uptime: ms(process.uptime() * 1000)};
    } catch (error) {
      throw new ServerError(error.message);
    }
  }
}
