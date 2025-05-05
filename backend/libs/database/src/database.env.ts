import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class DatabaseEnv {
  @EnvProperty({
    name: 'SHARED_DATABASE_CONNECTION_STRING',
    schema: Joi.string().uri().required(),
  })
  connectionString: string;

  @EnvProperty({
    name: 'SHARED_DATABASE_LOGGING',
    schema: Joi.boolean().truthy('1', 'true').falsy('0', 'false'),
  })
  logging: boolean;
}
