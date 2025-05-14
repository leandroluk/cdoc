import {Injectable} from '@nestjs/common';
import {type EMailerProvider} from '../mailer.types';

export function MailerProvider(kind: EMailerProvider): ClassDecorator {
  return function <T extends Function>(target: T) {
    MailerProvider.map.set(kind, target);
    Injectable()(target);
  };
}
export namespace MailerProvider {
  export const key = Symbol('MailerProvider');
  export const map = new Map<EMailerProvider, Function>();
  export const get = (type: EMailerProvider): Function => map.get(type)!;
}
