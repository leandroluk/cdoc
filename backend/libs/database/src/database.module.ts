import {Module, Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import {DatabaseEnv} from './database.env';
import {DatabaseService} from './database.service';

const providers = Array<Provider>().concat(DatabaseEnv, DatabaseService);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class DatabaseModule {}
