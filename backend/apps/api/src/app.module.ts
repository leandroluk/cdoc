import {Module, Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import {AppEnv} from './app.env';
import {ResourcesModule} from './resources';

@Module({
  imports: [LoggerModule, ResourcesModule],
  providers: Array<Provider>().concat(AppEnv),
})
export class AppModule {}
