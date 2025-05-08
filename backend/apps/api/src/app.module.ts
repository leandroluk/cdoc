import {Module, Provider} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import {AppEnv} from './app.env';
import {AppService} from './app.service';
import {ResourcesModule} from './resources';

@Module({
  imports: [LoggerModule, ResourcesModule],
  providers: Array<Provider>().concat(AppEnv, AppService),
})
export class AppModule {}
