import {SetMetadata} from '@nestjs/common';
import {CACHE_IDEMPOTENT_METADATA_KEY} from '../cache.constants';

/**
 * The term idempotent comes from the field of mathematics and computer science
 * and refers to an operation that, when performed multiple times, will always
 * produce the same result. That is, no matter how many times the operation is
 * repeated, the effect will be the same after the first execution.
 */
export function Idempotent(): ReturnType<typeof SetMetadata> {
  return SetMetadata(CACHE_IDEMPOTENT_METADATA_KEY, true);
}
