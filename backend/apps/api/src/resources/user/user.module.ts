import {Module, Provider} from '@nestjs/common';
import {CacheModule} from 'libs/cache';
import {DatabaseModule} from 'libs/database';
import {MailerModule} from 'libs/mailer';
import {SessionModule} from 'libs/session';
import {StorageModule} from 'libs/storage';
import {StreamModule} from 'libs/stream';
import * as services from './services';
import * as subscribers from './subscribers';
import {UserController} from './user.controller';

@Module({
  imports: [CacheModule, DatabaseModule, MailerModule, SessionModule, StorageModule, StreamModule],
  providers: Array<Provider>().concat(Object.values(services), Object.values(subscribers)),
  controllers: [UserController],
})
export class UserModule {}
