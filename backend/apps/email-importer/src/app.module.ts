import {Module} from '@nestjs/common';
import {AppEnv} from './app.env';

@Module({
  imports: [],
  providers: [AppEnv],
})
export class AppModule {}
