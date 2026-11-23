import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { createCacheContext } from '../../../shared/utils/http-cache.util';
import { AppInitService } from '../../auth/services/appinit/appinit.service';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminReportsStatusService {
  private http = inject(HttpClient);
  private appInit: any = inject(AppInitService);

  private readonly endPointCustomReports = '/api/v3/admin/reports/customReports/';

  private get cId(): string { //20261113 dynamic getter prevents undefined cId if service loads before AppInitService finishes
    return this.appInit.get_cId();
  }

  private get versiondb(): string { //20261113 dynamic getter avoids reading appConfig before Init() resolves
    return this.appInit.appConfig?.['versiondb'] || 'ng750';
  }

  // status/statistics

  getServerInfo(): Observable<any> {
    //  console.log('getServerStatus');
    const cacheKey = `status:serverInfo:${this.cId}:${this.versiondb}`;
    return this.http
      .post('/api/v3/admin/serverInfo', { 'cId': this.cId },
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: 10000 })
        }
      );
    //    .pipe(retry(3)); // removed 20241006
  }

  getEventChoiceStatus(): Observable<any> {
    // console.log('getServerStatus');
    const cacheKey = `status:CurrentData:${this.cId}:${this.versiondb}`;
    return this.http
      .post('/api/v3/admin/statusData', { 'cId': this.cId },
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: 10000 })
        }
      );
  }

  getStatusArchivedWithData(): Observable<any> {
    // 20260811 removed double hit, all in purge-list now
    // 20260607 if data is present, we get a double call
    // once in status.html or eventsList to check if data exists and once in the child component that is also used in eventsList
    // it is now cached on the status path for 5 seconds so

    //   console.log('getStatusArchivedWithData');
    const cacheKey = `status:ArchivedData:${this.cId}:${this.versiondb}`;

    return this.http.post(
      '/api/v3/admin/statusArchivedWithData',
      {
        cId: this.cId,
        versiondb: this.versiondb
      },
      {   // 20260611
        context: createCacheContext({ cacheKey: cacheKey, ttl: 30000 })
      }
    );
  }

  // charts
  getEventTrace(optionsBody: any): Observable<any> {
    //  console.log(optionsBody)
    const cacheKey = `status:chart:${optionsBody.cId}:${optionsBody.eventId}`;
    return this.http
      .post('/api/v3/admin/reports/statisticsChart', optionsBody,
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: 30000 })
        }
      );
  }

  getCustomReports(eventId: string): Observable<any> {
    return this.http
      .get(this.endPointCustomReports + eventId);
  }

  saveCustomReports(eventId: string, toSave: Object): Observable<any> {
    return this.http
      .put(this.endPointCustomReports + eventId, toSave);
  }

  getAdminGridData(refreshEndPoint: string, optionsBody: any): Observable<any> {  // for the admin grid view  
    // the endpoint may differ based on the data set required
    return this.http
      .post(refreshEndPoint, optionsBody);
  }

  viewCall(options: any): Observable<any> { // calling one of the sql views
    //  console.log(options)
    return this.http
      .post('/api/v3/admin/reports/rawViewQuery', options);
  }
}
