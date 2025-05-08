import {type TSession} from '@cdoc/domain';
import {applyDecorators, SetMetadata, UseInterceptors} from '@nestjs/common';
import {CACHE_CACHED_REQUEST_METADATA_KEY} from '../cache.constants';
import {CachedRequestInterceptor} from '../interceptors';

export function CachedRequest(
  cacheKeyGeneratorFn: (req: Request & {session: TSession}) => string,
  expireInSeconds = 60
): MethodDecorator {
  return applyDecorators(
    SetMetadata(CACHE_CACHED_REQUEST_METADATA_KEY, [cacheKeyGeneratorFn, expireInSeconds]),
    UseInterceptors(CachedRequestInterceptor)
  );
}
