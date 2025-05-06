import {Module, Provider} from '@nestjs/common';
import {CommonModule} from 'libs/common';
import {CryptoModule} from 'libs/crypto';
import {DatabaseModule} from 'libs/database';
import {SessionModule} from 'libs/session';
import {StorageModule} from 'libs/storage';
import {StreamModule} from 'libs/stream';
import {AuthController} from './auth.controller';
import * as services from './services';

@Module({
  imports: [CommonModule, CryptoModule, DatabaseModule, SessionModule, StorageModule, StreamModule],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [AuthController],
})
export class AuthModule {}
