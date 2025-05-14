import {MailerModule as NestJSMailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module, type Provider} from '@nestjs/common';
import * as mailerProviders from './mailer-providers';
import {MailerEnv} from './mailer.env';
import {MailerProviderBus} from './mailer.provider-bus';

const providers = Array<Provider>().concat(MailerEnv, MailerProviderBus, Object.values(mailerProviders));

@Module({
  imports: [
    NestJSMailerModule.forRootAsync({
      imports: [],
      extraProviders: [MailerEnv],
      inject: [MailerEnv],
      useFactory: async (mailerEnv: MailerEnv) => {
        return {
          defaults: {from: mailerEnv.smtpDefaultFrom},
          transport: {
            host: mailerEnv.smtpHostname,
            secure: mailerEnv.smtpSecure,
            ignoreTLS: mailerEnv.smtpIgnoreTls,
            port: mailerEnv.smtpPort,
            auth: mailerEnv.smtpUsername ? {user: mailerEnv.smtpUsername, pass: mailerEnv.smtpPassword} : null,
          },
          template: {
            dir: `${__dirname}/templates`,
            adapter: new HandlebarsAdapter(),
            options: {strict: true},
          },
        };
      },
    }),
  ],
  providers,
  exports: providers,
})
export class MailerModule {}
