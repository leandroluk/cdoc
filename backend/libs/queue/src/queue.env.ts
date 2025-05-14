import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';
import {EQueueProvider} from './queue.types';

@Injectable()
export class QueueEnv {
  @EnvProperty({
    name: 'LIBS_QUEUE_PROVIDER',
    schema: Joi.string()
      .valid(...Object.values(EQueueProvider))
      .default(EQueueProvider.Redis),
  })
  provider: EQueueProvider;

  @EnvProperty({
    name: 'LIBS_QUEUE_REDIS_CONNECTION_STRING',
    schema: Joi.string().default('redis://localhost:6379/0'),
  })
  redisConnectionString: string;

  @EnvProperty({
    name: 'LIBS_QUEUE_AWS_REGION',
    schema: Joi.string().default('{{LIBS_QUEUE_AWS_REGION}}'),
  })
  awsRegion: string;

  @EnvProperty({
    name: 'LIBS_QUEUE_AWS_ACCESS_KEY_ID',
    schema: Joi.string().default('{{LIBS_QUEUE_AWS_REGION}}'),
  })
  awsAccessKeyId: string;

  @EnvProperty({
    name: 'LIBS_QUEUE_AWS_SECRET_ACCESS_KEY',
    schema: Joi.string().default('{{LIBS_QUEUE_AWS_REGION}}'),
  })
  awsSecretAccessKey: string;

  @EnvProperty({
    name: 'LIBS_QUEUE_AWS_ACCOUNT_ID',
    schema: Joi.string().default('{{LIBS_QUEUE_AWS_ACCOUNT_ID}}'),
  })
  awsAccountId: string;
}
