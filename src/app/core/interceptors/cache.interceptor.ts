// 20260610

// to cache some http calls for a short period of time

import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { HttpCacheService } from './http-cache.service';
import { CACHE_KEY, CACHE_TTL, CACHEABLE, PREFIX_DELETE } from '../../../shared/constants/cache.tokens';

export function CacheInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {

  // 20260811
  /*
   cache client side some calls for a short period of time, ttl rather than going to the server again.
   Also checks for multiple calls of the http and dedups with the inflight cache.
   Not cancelling the previous call as this is not search key stroke based
   Would need to change logic if cancelling and swapping in the new call.
  */

  const cacheStore = inject(HttpCacheService);   // for http responses 20260811 + 10

  // console.log("CacheInterceptor")

  //20261113 run prefix invalidation BEFORE checking CACHEABLE so non-cacheable mutations can bust stale read caches
  const prefix_delete = req.context.get(PREFIX_DELETE);
  if (prefix_delete) {
    //  console.log(prefix_delete)
    cacheStore.invalidateByPrefix(prefix_delete);
  }

  const cacheable = req.context.get(CACHEABLE);
  if (!cacheable) {
    return next(req);
  }

  const key = req.context.get(CACHE_KEY);
  if (!key) {
    return next(req);
  }

  // console.log(key)
  const ttl = req.context.get(CACHE_TTL) ?? 30000;

  // -----------------------------
  // 1. RETURN CACHED VALUE (TTL)
  // -----------------------------
  //20261113 cacheStore.get(key) now automatically checks expiry and deletes stale entries
  const cached = cacheStore.get(key);
  if (cached) {
    // console.log('cached value for: ' + key)
    return cached.response$;
  }

  // -----------------------------
  // 2. RETURN IN-FLIGHT REQUEST, not in the cache so an api call required, but check not one in progress
  //                              this is like a debounce of the call, but the FIRST call wins, not search key feature
  // -----------------------------
  const existingInFlight = cacheStore.getInFlight(key); //20261113 delegated to HttpCacheService
  if (existingInFlight) {   // this works as I simulated a double inflight and only one reached the server
    // console.log('existingInFlight for: ' + key)
    return existingInFlight;
  }

  // -----------------------------
  // 3. CREATE REQUEST
  // -----------------------------
  const response$ = next(req).pipe(
    //  delay(400 + Math.random() * 400), // simulate random delay
    tap({
      next: (event) => { //20261113 store in cache only when an actual HttpResponse arrives
        if (event instanceof HttpResponse) {
          cacheStore.set(key, response$, ttl);
        }
      },
      error: () => {
        cacheStore.delete(key);
      }
    }),
    finalize(() => {
      //  console.log('inflight tidy for: ' + key)
      cacheStore.deleteInFlight(key); //20261113 delegated to HttpCacheService
    }),
    shareReplay(1)
  );

  // -----------------------------
  // 4. STORE IN-FLIGHT
  // -----------------------------
  cacheStore.setInFlight(key, response$); //20261113 delegated to HttpCacheService

  return response$;
}
