import {Injectable} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {type Readable} from 'node:stream';
import {MailerProvider} from './decorators';
import {MailerEnv} from './mailer.env';

@Injectable()
export class MailerService implements MailerProvider.Type {
  constructor(
    private readonly mailerEnv: MailerEnv,
    private readonly moduleRef: ModuleRef
  ) {}

  async sendEmail<T extends Record<string, unknown> = Record<string, unknown>>(
    data: {
      to?: Array<string>;
      cc?: Array<string>;
      bcc?: Array<string>;
      replyTo?: Array<string>;
      from?: string;
      subject?: string;
      template?: string;
      context?: T;
      html?: string;
      attachments?: Array<Readable>;
    },
    kind?: MailerProvider.Kind
  ): Promise<void> {
    return await this.moduleRef
      .get<MailerProvider.Type>(kind ?? MailerProvider.get(this.mailerEnv.provider))
      .sendEmail(data);
  }
}
