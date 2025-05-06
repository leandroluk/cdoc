import {Module, Provider} from '@nestjs/common';
import {MailerModule} from 'libs/mailer';
import {SessionModule} from 'libs/session';
import {StreamModule} from 'libs/stream';
import * as services from './services';
import * as subscribers from './subscribers';
import {UserController} from './user.controller';

@Module({
  imports: [MailerModule, SessionModule, StreamModule],
  providers: Array<Provider>().concat(Object.values(services), Object.values(subscribers)),
  controllers: [UserController],
})
export class UserModule {}
