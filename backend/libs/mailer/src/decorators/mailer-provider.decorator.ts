import {type Readable} from 'node:stream';

export function MailerProvider(kind: MailerProvider.Kind): ClassDecorator {
  return function <T extends Function>(target: T) {
    MailerProvider.map.set(kind, target);
  };
}
export namespace MailerProvider {
  export const key = Symbol('MailerProvider');
  export const map = new Map<MailerProvider.Kind, Function>();
  export const get = (type: MailerProvider.Kind): Function => map.get(type)!;
  export type Type = {
    sendEmail<T extends Record<string, unknown> = Record<string, unknown>>(data: {
      to?: Array<string>;
      cc?: Array<string>;
      bcc?: Array<string>;
      replyTo?: Array<string>;
      from?: string;
      subject?: string;
      /** Handebars template */
      template?: string;
      context?: T;
      html?: string;
      attachments?: Array<Readable>;
    }): Promise<void>;
  };
  export enum Kind {
    Smtp = 'smtp',
  }
}
