import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {CorsMiddleware} from 'libs/common/middlewares';
import {DatabaseModule} from 'libs/database';
import {LoggerModule} from 'libs/logger';
import {AppEnv} from './app.env';

@Module({
  imports: [
    // external imports
    ScheduleModule.forRoot(),
    // internal imports
    DatabaseModule,
    LoggerModule,
  ],
  providers: [AppEnv],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
