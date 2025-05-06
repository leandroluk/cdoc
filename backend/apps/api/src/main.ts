import {NestFactory} from '@nestjs/core';
import {type NestExpressApplication} from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {LoggerService} from 'libs/logger';
import packageJson from 'package.json';
import {AppEnv} from './app.env';
import {AppModule} from './app.module';

LoggerService.setAppName('api');

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {bufferLogs: true});

  const appEnv = app.get(AppEnv);
  const loggerService = await app.resolve(LoggerService);

  app.disable('x-powered-by');
  app.useLogger(loggerService);
  app.setGlobalPrefix(appEnv.prefix);

  const config = new DocumentBuilder()
    .setTitle(packageJson.displayName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .setContact(packageJson.author.name, packageJson.author.url, packageJson.author.email)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const logUrl = `/${[appEnv.prefix, 'system', 'log'].filter(Boolean).join('/')}`;

  SwaggerModule.setup(appEnv.prefix, app, document, {
    customJsStr: `new EventSource('${logUrl}').onmessage = e => console.log(e.data)`,
  });

  await app.listen(appEnv.port);

  loggerService.log(`✅ started on port ${appEnv.port}`, 'bootstrap');
}
bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
