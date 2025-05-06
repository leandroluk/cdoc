import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import Redis from 'ioredis';
import {from, Observable, switchMap, throwError} from 'rxjs';
import {CACHE_IDEMPOTENT_METADATA_KEY} from '../cache.constants';

@Injectable()
export class IdempotentInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redis: Redis
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isIdempotent = this.reflector.get<boolean>(CACHE_IDEMPOTENT_METADATA_KEY, context.getHandler());

    if (!isIdempotent) {
      return next.handle();
    }

    const event = context.getArgs()[0];
    const eventId = event?.id;

    if (!eventId) {
      return next.handle();
    }

    const redisKey = `stream:event:${eventId}`;

    return from(this.redis.set(redisKey, '1', 'EX', 3600, 'NX')).pipe(
      switchMap(result => {
        if (result === null) {
          return throwError(() => new Error('Duplicate event'));
        }
        return next.handle();
      })
    );
  }
}
