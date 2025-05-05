import {Module, Provider} from '@nestjs/common';
import {DatabaseEnv} from './database.env';
import * as factories from './factories';

const providers = Array<Provider>().concat(DatabaseEnv, Object.values(factories));

@Module({
  providers,
  exports: providers,
})
export class DatabaseModule {}
