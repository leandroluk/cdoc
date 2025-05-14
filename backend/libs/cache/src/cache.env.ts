import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class CacheEnv {
  @EnvProperty({
    name: 'LIBS_CACHE_CONNECTION_STRING',
    schema: Joi.string().uri().default('redis://localhost:6379/0'),
  })
  connectionString: string;
}
