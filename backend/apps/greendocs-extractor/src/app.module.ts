import {MiddlewareConsumer, Module, NestModule, Provider} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {CommonModule, CorsMiddleware} from 'libs/common';
import {AppEnv} from './app.env';
import {ResourceModule} from './resource';

@Module({
  imports: [
    // external imports
    ScheduleModule.forRoot(),
    // libs imports
    CommonModule,
    // internal imports
    ResourceModule,
  ],
  providers: Array<Provider>().concat(AppEnv),
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
