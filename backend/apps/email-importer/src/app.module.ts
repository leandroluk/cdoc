import {Module} from '@nestjs/common';
import {LoggerModule} from 'libs/logger';
import {AppEnv} from './app.env';
import {ResourcesModule} from './resources';

@Module({
  imports: [LoggerModule, ResourcesModule],
  providers: [AppEnv],
})
export class AppModule {}
