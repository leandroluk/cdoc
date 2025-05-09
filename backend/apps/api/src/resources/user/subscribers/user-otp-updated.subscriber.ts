import {Injectable} from '@nestjs/common';
import {Idempotent} from 'libs/cache';
import {MailerService} from 'libs/mailer';
import {SubscribeEvent, UserOtpUpdatedEvent, type TStream} from 'libs/stream';

@Injectable()
export class UserOtpUpdatedSubscriber implements TStream.Subscriber<UserOtpUpdatedEvent> {
  constructor(private readonly mailerService: MailerService) {}

  @Idempotent()
  @SubscribeEvent(UserOtpUpdatedEvent)
  async handle({payload}: UserOtpUpdatedEvent): Promise<void> {
    await this.mailerService.sendEmail({
      subject: 'One Time Password (OTP)',
      to: [payload.email],
      template: 'otp',
      context: {code: payload.Otp.code},
    });
  }
}
