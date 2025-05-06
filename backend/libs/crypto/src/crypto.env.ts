import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class CryptoEnv {
  @EnvProperty({
    name: 'LIBS_CRYPTO_KEY',
    schema: Joi.string().length(32).default('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
  })
  key: string;
}
