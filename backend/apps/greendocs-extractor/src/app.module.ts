import {Module, Provider} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {CommonModule} from 'libs/common';
import {AppEnv} from './app.env';
import {ResourcesModule} from './resources';

@Module({
  imports: [
    // external imports
    ScheduleModule.forRoot(),
    // libs imports
    CommonModule,
    // internal imports
    ResourcesModule,
  ],
  providers: Array<Provider>().concat(AppEnv),
})
export class AppModule {}
