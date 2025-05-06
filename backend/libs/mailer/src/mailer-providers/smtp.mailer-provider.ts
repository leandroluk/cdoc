import {MailerService as NodemailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {type Readable} from 'node:stream';
import {MailerProvider} from '../decorators';

@Injectable()
@MailerProvider(MailerProvider.Kind.Smtp)
export class SmtpMailerProvider implements MailerProvider.Type {
  constructor(private readonly nodemailerService: NodemailerService) {}

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
