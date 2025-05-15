import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';

@Injectable()
export class StreamEnv {
  @EnvProperty({
    name: 'LIBS_STREAM_URL',
    schema: Joi.string().default('redis://localhost:6379/1'),
  })
  connectionString: string;
}
