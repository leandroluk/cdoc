import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';
import {EStorageProvider} from './storage.types';

@Injectable()
export class StorageEnv {
  @EnvProperty({
    name: 'LIBS_STORAGE_LOCAL_PATH',
    schema: Joi.string().default('./.tmp/storage'),
  })
  localPath: string;

  @EnvProperty({
    name: 'LIBS_STORAGE_PROVIDER',
    schema: Joi.string()
      .valid(...Object.values(EStorageProvider))
      .default(EStorageProvider.Local),
  })
  provider: EStorageProvider;

  @EnvProperty({
    name: 'LIBS_STORAGE_USER_PICTURE_SIZE',
    schema: Joi.number().positive().integer().default(192),
  })
  userPictureSize: number;

  @EnvProperty({
    name: 'LIBS_STORAGE_USER_PICTURE_URL',
    schema: Joi.string().default('/user/{{userId}}/picture.{{ext}}'),
  })
  userPictureUrl: number;

  @EnvProperty({
    name: 'LIBS_STORAGE_USER_COVER_URL',
    schema: Joi.string().default('/user/{{userId}}/cover.{{ext}}'),
  })
  userCoverUrl: number;
}
