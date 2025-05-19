import {Injectable, OnModuleInit} from '@nestjs/common';
import {MailerProviderBus} from './mailer.provider-bus';

@Injectable()
export class MailerLifecycle implements OnModuleInit {
  constructor(private readonly mailerProviderBus: MailerProviderBus) {}

  async onModuleInit(): Promise<void> {
    await this.mailerProviderBus.connect();
  }
}
