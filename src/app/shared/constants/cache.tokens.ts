import { HttpContextToken } from '@angular/common/http';

//20261113 HttpContextTokens used to pass cache metadata to CacheInterceptor without sending headers to server
export const CACHEABLE = new HttpContextToken<boolean>(() => false);
export const CACHE_KEY = new HttpContextToken<string>(() => '');
export const CACHE_TTL = new HttpContextToken<number>(() => 30000);
export const PREFIX_DELETE = new HttpContextToken<string | null>(() => null);
