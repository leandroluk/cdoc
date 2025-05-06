import {Module, type Provider} from '@nestjs/common';
import {CacheModule} from 'libs/cache';
import {SessionEnv} from './session.env';
import {SessionService} from './session.service';

const providers = Array<Provider>(SessionEnv, SessionService);

@Module({
  imports: [CacheModule],
  providers,
  exports: providers,
})
export class SessionModule {}
