import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class AppEnv {
  @EnvProperty({
    name: 'APPS_API_PORT',
    schema: Joi.number().integer().positive().default(4000),
  })
  port: number;

  @EnvProperty({
    name: 'APPS_API_PREFIX',
    schema: Joi.string().default('').allow(''),
  })
  prefix: string;

  @EnvProperty({
    name: 'APPS_API_ORIGIN',
    schema: Joi.string().default('*'),
  })
  origin: string;

  @EnvProperty({
    name: 'APPS_API_CERT',
    schema: Joi.string().required(),
  })
  cert: string;

  @EnvProperty({
    name: 'APPS_API_KEY',
    schema: Joi.string().required(),
  })
  key: string;
}
