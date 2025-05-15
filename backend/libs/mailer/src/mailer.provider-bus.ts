import {Injectable, OnModuleInit} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {type Readable} from 'node:stream';
import {MailerProvider} from './decorators';
import {MailerEnv} from './mailer.env';
import {TMailerProvider} from './mailer.types';

@Injectable()
export class MailerProviderBus implements TMailerProvider, OnModuleInit {
  constructor(
    private readonly mailerEnv: MailerEnv,
    private readonly moduleRef: ModuleRef
  ) {}

  get provider(): TMailerProvider {
    return this.moduleRef.get<TMailerProvider>(MailerProvider.get(this.mailerEnv.provider));
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async connect(): Promise<void> {
    return await this.provider.connect();
  }

  async ping(): Promise<void> {
    return await this.provider.ping();
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
    return await this.provider.sendEmail(data);
  }
}
