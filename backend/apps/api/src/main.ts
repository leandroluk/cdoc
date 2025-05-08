import {COOKIE_SESSION_ID} from '@cdoc/domain';
import {UnauthorizedException} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ExpressAdapter, type NestExpressApplication} from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import helmet from 'helmet';
import {LoggerService} from 'libs/logger';
import packageJson from 'package.json';
import {AppEnv} from './app.env';
import {AppModule} from './app.module';
import {AppService} from './app.service';

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
  app.enableCors({
    credentials: true,
    origin(requestOrigin, callback) {
      if (!requestOrigin) {
        return callback(null, false);
      }

      if (appEnv.origin === '*') {
        return callback(null, requestOrigin);
      }

      const allowedOrigins = appEnv.origin.replace(/\s/g, '').split(',');
      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, requestOrigin);
      }

      return callback(new UnauthorizedException('Origin not allowed by CORS'));
    },
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
  await app.get(AppService).listen(server);
}

bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
