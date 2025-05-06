import {Module, Provider} from '@nestjs/common';
import {AppEnv} from './app.env';
import {ResourcesModule} from './resources';

@Module({
  imports: [ResourcesModule],
  providers: Array<Provider>().concat(AppEnv),
})
export class AppModule {}
