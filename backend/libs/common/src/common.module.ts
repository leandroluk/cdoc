import {Module, type Provider} from '@nestjs/common';
import {CommonEnv} from './common.env';

const providers = Array<Provider>().concat(CommonEnv);

@Module({
  providers,
  exports: providers,
})
export class CommonModule {}
