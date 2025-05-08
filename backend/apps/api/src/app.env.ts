import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class AppEnv {
  @EnvProperty({
    name: 'APPS_API_HTTP_PORT',
    schema: Joi.number().integer().positive().default(4000),
  })
  httpPort: number;

  @EnvProperty({
    name: 'APPS_API_HTTPS_PORT',
    schema: Joi.number().integer().positive().default(4433),
  })
  httpsPort: number;

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
    name: 'APPS_API_HTTPS_CERT',
    schema: Joi.string(),
  })
  httpsCert: string;

  @EnvProperty({
    name: 'APPS_API_HTTPS_KEY',
    schema: Joi.string(),
  })
  httpsKey: string;
}
