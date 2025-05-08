import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable, firstValueFrom, from} from 'rxjs';
import {CACHE_CACHED_REQUEST_METADATA_KEY as KEY} from '../cache.constants';
import {CacheService} from '../cache.service';
import {CachedRequest} from '../decorators';

@Injectable()
export class CachedRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const handler = context.getHandler();
    const [fn, ttl] = this.reflector.get<Parameters<typeof CachedRequest>>(KEY, handler) || [];
    return fn ? from(this.handleCache(fn(request), next, ttl!)) : next.handle();
  }

  private async handleCache(key: string, next: CallHandler, expireInSeconds: number): Promise<any> {
    try {
      const cached = await this.cacheService.get(key);
      if (cached) {
        return cached;
      }
    } catch {
      // log se quiser
    }
    const result = await firstValueFrom(next.handle());
    void this.cacheService.set(key, result, expireInSeconds);
    return result;
  }
}
