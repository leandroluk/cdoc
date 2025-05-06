import {Injectable} from '@nestjs/common';
import Joi from 'joi';
import {EnvProperty} from 'libs/common';
import {MailerProvider} from './decorators';

@Injectable()
export class MailerEnv {
  @EnvProperty({
    name: 'LIBS_MAILER_PROVIDER',
    schema: Joi.string()
      .valid(...Object.values(MailerProvider.Kind))
      .default(MailerProvider.Kind.Smtp),
  })
  provider: MailerProvider.Kind;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_DEFAULT_FROM',
    schema: Joi.string().default('no-reply@cdoc.com'),
  })
  smtpDefaultFrom: string;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_HOSTNAME',
    schema: Joi.string().default('sandbox.smtp.mailtrap.io'),
  })
  smtpHostname: string;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_IGNORE_TLS',
    schema: Joi.string().default(true),
  })
  smtpIgnoreTls: boolean;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_PASSWORD',
    schema: Joi.string(),
  })
  smtpPassword?: string;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_PORT',
    schema: Joi.number().integer().positive().default(2525),
  })
  smtpPort: number;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_SECURE',
    schema: Joi.boolean().default(false).truthy('1', 'true').falsy('0', 'false'),
  })
  smtpSecure: boolean;

  @EnvProperty({
    name: 'LIBS_MAILER_SMTP_USERNAME',
    schema: Joi.string(),
  })
  smtpUsername?: string;
}
