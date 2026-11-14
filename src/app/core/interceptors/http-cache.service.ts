import { inject, Injectable } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CacheEntry {
  response$: Observable<HttpEvent<any>>;
  expiry: number;
}

@Injectable({ providedIn: 'root' })
export class HttpCacheService {

  private singletonGuard = inject(HttpCacheService, { skipSelf: true, optional: true });

  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Observable<HttpEvent<any>>>(); //20261113 centralised inFlight map inside service so clear() and invalidateByPrefix() wipe active requests

  constructor() {
    if (this.singletonGuard) {
      throw new Error('HttpCacheService is already loaded');
    }
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    if (entry.expiry <= Date.now()) { //20261113 automatically evict expired entries on lookup
      this.cache.delete(key);
      return undefined;
    }

    return entry;
  }

  set(key: string, response$: Observable<HttpEvent<any>>, ttl: number): void {
    this.cache.set(key, {
      response$,
      expiry: Date.now() + ttl
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.inFlight.delete(key); //20261113 keep inFlight in sync when deleting key
  }

  getInFlight(key: string): Observable<HttpEvent<any>> | undefined { //20261113
    return this.inFlight.get(key);
  }

  setInFlight(key: string, response$: Observable<HttpEvent<any>>): void { //20261113
    this.inFlight.set(key, response$);
  }

  deleteInFlight(key: string): void { //20261113
    this.inFlight.delete(key);
  }

  clear(): void {
    //  console.log('clearing http cache')
    this.cache.clear();
    this.inFlight.clear(); //20261113 wipe in-flight calls on logout or cId switch
  }

  // ability to name space the keys and delete a subset
  // e.g. "status:" is used for the status view http caching, see SecureAPI.service and CACHE_KEY
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
    for (const key of this.inFlight.keys()) { //20261113 also remove matching in-flight requests so stale calls do not win race
      if (key.startsWith(prefix)) {
        this.inFlight.delete(key);
      }
    }
  }

}
