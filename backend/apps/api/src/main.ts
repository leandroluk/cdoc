import {COOKIE_SESSION_ID, UnauthorizedError} from '@cdoc/domain';
import {NestFactory} from '@nestjs/core';
import {ExpressAdapter, type NestExpressApplication} from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import helmet from 'helmet';
import https from 'https';
import {DomainErrorFilter} from 'libs/common';
import {LoggerService} from 'libs/logger';
import packageJson from 'package.json';
import {AppEnv} from './app.env';
import {AppModule} from './app.module';

dotenvExpand.expand(dotenv.config());

LoggerService.setAppName('api');

export async function bootstrap(): Promise<void> {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  const appEnv = app.get(AppEnv);
  const loggerService = await app.resolve(LoggerService);

  app.disable('x-powered-by');
  app.setGlobalPrefix(appEnv.prefix);
  app.useLogger(loggerService);
  app.useGlobalFilters(new DomainErrorFilter());
  app.enableCors({
    credentials: true,
    origin: (origin, callback) =>
      !origin
        ? callback(null, false)
        : appEnv.origin === '*' || appEnv.origin.replace(/\s/g, '').split(',').includes(origin)
          ? callback(null, origin)
          : callback(new UnauthorizedError('Origin not allowed by CORS')),
  });
  app.use(helmet());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle(packageJson.displayName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addCookieAuth(COOKIE_SESSION_ID)
    .setContact(packageJson.author.name, packageJson.author.url, packageJson.author.email)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const logUrl = `/${[appEnv.prefix, 'system', 'log'].filter(Boolean).join('/')}`;

  SwaggerModule.setup(appEnv.prefix, app, document, {
    swaggerOptions: {persistAuthorization: true},
    customJsStr: `new EventSource('${logUrl}').onmessage = e => console.log(e.data)`,
  });

  await app.init();

  https.createServer({cert: appEnv.cert, key: appEnv.key}, server).listen(appEnv.port, () => {
    loggerService.log(`✅ HTTPS server started on port ${appEnv.port}`);
  });
}

bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
