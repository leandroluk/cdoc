import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class AppEnv {
  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_PORT',
    schema: Joi.number().integer().positive().default(4001),
  })
  port: number;

  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_PREFIX',
    schema: Joi.string().default('').allow(''),
  })
  prefix: string;

  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_HEADLESS',
    schema: Joi.boolean().truthy('1', 'true').falsy('0', 'false').default(true),
  })
  headless: boolean;

  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_BASE_URL',
    schema: Joi.string().uri().required(),
  })
  baseUrl: string;

  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_EMAIL',
    schema: Joi.string().email({tlds: false}).required(),
  })
  email: string;

  @EnvProperty({
    name: 'APPS_GREENDOCS_EXTRACTOR_PASSWORD',
    schema: Joi.string().required(),
  })
  password: string;
}
