import {Injectable, OnApplicationShutdown} from '@nestjs/common';
import {Express} from 'express';
import http from 'http';
import https from 'https';
import {LoggerService} from 'libs/logger';
import {AppEnv} from './app.env';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private servers: http.Server[] = [];

  constructor(
    private readonly appEnv: AppEnv,
    private readonly loggerService: LoggerService
  ) {}

  public async onApplicationShutdown(): Promise<void> {
    await Promise.all(
      this.servers.map(server => {
        return new Promise((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve(null)));
        });
      })
    );
  }

  public async listen(server: Express): Promise<void> {
    this.servers.push(http.createServer(server).listen(this.appEnv.httpPort));
    this.loggerService.log(`✅ HTTP started on port ${this.appEnv.httpPort}`);

    if (this.appEnv.httpsCert && this.appEnv.httpsKey) {
      const httpOptions = {
        cert: this.appEnv.httpsCert?.replace(/\\n/g, '\n'),
        key: this.appEnv.httpsKey?.replace(/\\n/g, '\n'),
      };
      this.servers.push(https.createServer(httpOptions, server).listen(this.appEnv.httpsPort));
      this.loggerService.log(`☑️  HTTPS started on port ${this.appEnv.httpsPort}`);
    }
  }
}
