// cors.middleware.ts
import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {CommonEnv} from '../common.env';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly commonEnv: CommonEnv) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const origin = req.headers.origin;

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (this.commonEnv.origin !== '*') {
      const allowedOrigins = this.commonEnv.origin.split(',');
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      } else {
        if (req.method === 'OPTIONS') {
          return res.status(403).end('Unauthorized origin');
        }
      }
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  }
}
