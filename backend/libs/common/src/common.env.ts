import {ETheme} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import ms from 'ms';
import {EnvProperty} from './decorators';

@Injectable()
export class CommonEnv {
  @EnvProperty({
    name: 'LIBS_COMMON_TZ',
    schema: Joi.string().default('UTC'),
  })
  tz: string;

  @EnvProperty({
    name: 'LIBS_COMMON_ENV',
    schema: Joi.string().allow('development', 'production').default('development'),
  })
  env: 'development' | 'production';

  @EnvProperty({
    name: 'LIBS_COMMON_ORIGIN',
    schema: Joi.string().default('*'),
  })
  origin: string;

  @EnvProperty({
    name: 'LIBS_COMMON_ACCESS_TTL',
    schema: Joi.string().default('10m'),
  })
  accessTtl: ms.StringValue;

  @EnvProperty({
    name: 'LIBS_COMMON_USER_DEFAULT_LOCALE',
    schema: Joi.string().default('pt-BR'),
  })
  userDefaultLocale: string;

  @EnvProperty({
    name: 'LIBS_COMMON_USER_DEFAULT_THEME',
    schema: Joi.string()
      .valid(...Object.values(ETheme))
      .default(ETheme.Light),
  })
  userDefaultTheme: ETheme;

  @EnvProperty({
    name: 'LIBS_COMMON_USER_DEFAULT_TIMEZONE',
    schema: Joi.string().default('UTC'),
  })
  userDefaultTimezone: string;

  @EnvProperty({
    name: 'LIBS_COMMON_API_BASE_URL',
    schema: Joi.string().default('http://localhost:4000'),
  })
  apiBaseUrl: string;

  @EnvProperty({
    name: 'LIBS_COMMON_MICROSOFT_CLIENT_ID',
    schema: Joi.string().default('{{LIBS_COMMON_MICROSOFT_CLIENT_ID}}'),
  })
  microsoftClientId: string;

  @EnvProperty({
    name: 'LIBS_COMMON_MICROSOFT_CLIENT_SECRET',
    schema: Joi.string().default('{{LIBS_COMMON_MICROSOFT_CLIENT_SECRET}}'),
  })
  microsoftClientSecret: string;

  @EnvProperty({
    name: 'LIBS_COMMON_OTP_EXPIRES_TIME',
    schema: Joi.string().default('10m'),
  })
  otpExpiresTime: ms.StringValue;

  @EnvProperty({
    name: 'LIBS_COMMON_RECOVER_URL',
    schema: Joi.string().uri().default('http://localhost:3000/recover'),
  })
  recoverUrl: string;

  @EnvProperty({
    name: 'LIBS_COMMON_REFRESH_TTL',
    schema: Joi.string().default('14d'),
  })
  refreshTtl: ms.StringValue;
}
