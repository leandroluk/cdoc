import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class DatabaseEnv {
  @EnvProperty({
    name: 'LIBS_DATABASE_URL',
    schema: Joi.string().uri().required(),
  })
  connectionString: string;

  @EnvProperty({
    name: 'LIBS_DATABASE_LOGGING',
    schema: Joi.boolean().truthy('1', 'true').falsy('0', 'false'),
  })
  logging: boolean;
}
