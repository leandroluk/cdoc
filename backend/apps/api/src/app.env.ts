import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class AppEnv {
  @EnvProperty({
    name: 'APPS_API_PORT',
    schema: Joi.number().integer().positive().default(4001),
  })
  port: number;

  @EnvProperty({
    name: 'APPS_API_PREFIX',
    schema: Joi.string().default('').allow(''),
  })
  prefix: string;
}
