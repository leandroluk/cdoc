import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';
import ms from 'ms';

@Injectable()
export class SessionEnv {
  @EnvProperty({
    name: 'LIBS_SESSION_PREFIX',
    schema: Joi.string().default('session'),
  })
  prefix: string;

  @EnvProperty({
    name: 'LIBS_SESSION_CONNECTION_STRING',
    schema: Joi.string().uri().default('redis://localhost:6379/0'),
  })
  connectionString: string;

  @EnvProperty({
    name: 'LIBS_SESSION_ACCESS_TTL',
    schema: Joi.string().default('4h'),
  })
  accessTtl: ms.StringValue;

  @EnvProperty({
    name: 'LIBS_SESSION_LIMIT_TTL',
    schema: Joi.string().default('14d'),
  })
  limitTtl: ms.StringValue;
}
