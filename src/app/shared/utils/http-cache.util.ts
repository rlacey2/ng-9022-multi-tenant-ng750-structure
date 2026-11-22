import { HttpContext } from '@angular/common/http';
import { CACHEABLE, CACHE_KEY, CACHE_TTL, PREFIX_DELETE } from '../constants/cache.tokens';
 

//20261113 extracted from SecureAPIService to share HttpContext caching metadata across all domain services
export interface CacheContextOptions {
  cacheKey: string;
  ttl?: number;
  cacheable?: boolean;
  prefix_delete?: string | null;
}

export function createCacheContext(options: CacheContextOptions): HttpContext { //20261113
  return new HttpContext()
    .set(CACHEABLE, options.cacheable ?? true)
    .set(CACHE_KEY, options.cacheKey)
    .set(CACHE_TTL, options.ttl ?? 30000)
    .set(PREFIX_DELETE, options.prefix_delete ?? null);
}

export function stableStringify(obj: unknown): string { //20261113 standalone function fixes recursive array this-binding
  // normalise the object to form a consistent key for caching
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(stableStringify).join(',')}]`;
  }

  const record = obj as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map(k => `"${k}":${stableStringify(record[k])}`)
    .join(',')}}`;
}
