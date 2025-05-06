import {Module, Provider} from '@nestjs/common';
import {AppEnv} from './app.env';

@Module({
  imports: [],
  providers: Array<Provider>().concat(AppEnv),
})
export class AppModule {}
