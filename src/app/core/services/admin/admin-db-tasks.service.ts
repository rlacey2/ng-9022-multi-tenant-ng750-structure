import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../../../shared/services/appinit/app-init.service';
import { createCacheContext, stableStringify } from '../../../shared/utils/http-cache.util';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminDbTasksService {
  private http = inject(HttpClient);
  private appInit: any = inject(AppInitService);

  private get cId(): string { //20261113 dynamic getter prevents undefined cId if service loads before AppInitService finishes
    return this.appInit.get_cId();
  }

  eventsListAll(options: any): Observable<any> { // dbtasks
    // dbtasks delete etc needs the cache to be skipped so ttl is 1/1000 sec
    console.log('eventsListAll');
    options.ttl = options.ttl || 60000;
    const xOptions = stableStringify(options);
    const cacheKey = `dbtasks:eventsList:${this.cId}:${xOptions}`;
    return this.http
      .post('/api/v3/admin/eventsall/', options,
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: options.ttl })
        }
      );
  }

  get_t99_key_name(name: string): Observable<any> {
    let httpcontext = {};
    if (name === 'rawviews') {
      const cacheKey = `dbtasks:rawviews:${this.cId}`;
      httpcontext = {   // 20260611
        context: createCacheContext({ cacheKey: cacheKey, ttl: 100000 })
      };
    }
    return this.http.get('/api/v3/admin/dbtasks/dictionary/' + name, httpcontext);
  }

  save_t99_key_name(keyData: object): Observable<any> {
    return this.http.post('/api/v3/admin/dbtasks/dictionary', keyData);
  }

  getMessage(tag: string): Observable<any> {
    var body = { cId: this.cId, tag: tag };
    return this.http.post('/api/v3/admin/message/' + tag, body);
  }

  saveMessage(messageData: string): Observable<any> {
    return this.http.post('/api/v3/admin/message', messageData);
  }

  invalidateTokens(options: any): Observable<any> { // dbtasks // same end point as global tokens
    return this.http
      .post('/api/v3/admin/clearTokens', options);
  }
}
