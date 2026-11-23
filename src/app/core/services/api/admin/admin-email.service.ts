import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createCacheContext } from '../../../../shared/utils/http-cache.util';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminEmailService {
  private http = inject(HttpClient);

  emailSend(mailOptions: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/emailGeneric', mailOptions);
  }

  emailReassembleForResend(mailOptions: any): Observable<any> {
    return this.http
      .put('/api/v3/admin/emailReassembleForResend', mailOptions);
  }

  emailFragmentTest(optionsBody: any): Observable<any> {
    return this.http
      .put('/api/v3/admin/emailFragmentTest', optionsBody);
  }

  testEmailCalendar(mailOptions: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/email/calendar', mailOptions);
  }

  reminderEmails(optionsBody: any): Observable<Object> { // 20250615
    return this.http
      .post('/api/v3/admin/email/reminderEmails', optionsBody);
  }

  reminderHistory(optionsBody: any): Observable<any> { // 20250621
    return this.http
      .post('/api/v3/admin/email/reminderHistory', optionsBody);
  }

  // an undelivered email address is found, now search for where used
  undeliveredMatchWith_t12(options: any): Observable<any> { // 20250616
    const postfix = (new Date(options.since).getTime().toString(36) + new Date(options.before).getTime().toString(36)) + options.email;
    const cacheKey = `dbtasks:undeliveredt12:${options.cId}:${postfix}`;
    return this.http
      .post('/api/v3/admin/email/undeliveredMatchWith_t12', options,
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: 300000 }) // just to have it 5 minutes rare change in that time as historical
        }
      );
  }

  fetchEmailAddresses(options: any): Observable<any> { // dbtasks //  20250613
    const postfix = (new Date(options.since).getTime().toString(36) + new Date(options.before).getTime().toString(36));
    const cacheKey = `dbtasks:undelivered:${options.cId}:${postfix}`;

    return this.http
      .post('/api/v3/admin/email/undelivered', options,
        {   // 20260611
          context: createCacheContext({ cacheKey: cacheKey, ttl: 300000 }) // just to have it 5 minutes rare change in that time as historical
        }
      );
  }
}
