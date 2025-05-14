import {type Readable} from 'stream';

export enum EMailerProvider {
  Smtp = 'smtp',
}

export type TMailerProvider = {
  connect(): Promise<void>;
  ping(): Promise<void>;
  sendEmail<T extends Record<string, unknown> = Record<string, unknown>>(data: {
    to?: Array<string>;
    cc?: Array<string>;
    bcc?: Array<string>;
    replyTo?: Array<string>;
    from?: string;
    subject?: string;
    template?: string; // Handebars template
    context?: T;
    html?: string;
    attachments?: Array<Readable>;
  }): Promise<void>;
};
