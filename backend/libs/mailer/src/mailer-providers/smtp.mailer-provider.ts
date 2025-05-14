import {MailerService as NodemailerService} from '@nestjs-modules/mailer';
import {type Readable} from 'node:stream';
import {MailerProvider} from '../decorators';
import {EMailerProvider, TMailerProvider} from '../mailer.types';

@MailerProvider(EMailerProvider.Smtp)
export class SmtpMailerProvider implements TMailerProvider {
  constructor(private readonly nodemailerService: NodemailerService) {}

  async connect(): Promise<void> {
    // // no need logic here
  }

  async ping(): Promise<void> {
    // // no need logic here
  }

  async sendEmail<T extends Record<string, unknown> = Record<string, unknown>>(data: {
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
  }): Promise<void> {
    return await this.nodemailerService.sendMail({
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      replyTo: data.replyTo,
      from: data.from,
      subject: data.subject,
      html: data.html,
      template: data.template,
      context: data.context,
      attachments: data.attachments,
    });
  }
}
