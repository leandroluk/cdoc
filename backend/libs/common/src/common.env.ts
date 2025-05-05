import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from './decorators';

@Injectable()
export class CommonEnv {
  @EnvProperty({
    name: 'LIBS_COMMON_TZ',
    schema: Joi.string().default('UTC'),
  })
  tz: string;

  @EnvProperty({
    name: 'LIBS_COMMON_NODE_ENV',
    schema: Joi.string().allow('development', 'production').default('development'),
  })
  env: 'development' | 'production';

  @EnvProperty({
    name: 'LIBS_COMMON_ORIGIN',
    schema: Joi.string().default('*'),
  })
  origin: string;
}
