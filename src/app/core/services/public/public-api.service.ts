// public api endpoints that do not require admin login

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppInitService } from '../../../shared/services/appinit/app-init.service';
import { createCacheContext } from '../../../shared/utils/http-cache.util'; //20261113

@Injectable({
  providedIn: 'root'
})
export class PublicAPIService {

  private http = inject(HttpClient);
  private appInit = inject(AppInitService);

  private get cId(): string { //20261113 dynamic getter prevents undefined cId if service loads before AppInitService finishes
    return this.appInit.get_cId();
  }

  headers = new HttpHeaders({
    'Content-Type': 'text/plain'
  });

  refreshAccessToken(): Observable<any> { // 20250830   20250831 TAP rxjs was ignoring this 
    return this.http
      .post('/public/refresh', {});
  }

  saveSubmission(dataToSave: any): Observable<any> {  // 20251121
    return this.http
      .post('/public/save/attendeesubmission', dataToSave);
  }

  attendeeRegistration(optionsBody: any): Observable<any> { // 20250220, member of public fills in attendance form
    return this.http
      .post('/public/save/attendeeregistration', optionsBody);
  }

  paymentIntents(body: any): Observable<any> {  // return a single event based on eventId
    return this.http
      .post('/public/pi/payment_intents', body); // ask the server to generate a payment intent from stripe
  }
 
  getOrganistions(optionsBody: object): Observable<any> { // nb post
    return this.http
      .post('/public/data/organisations', optionsBody);
  }

  getEventsEnabled(optionsBody: object): Observable<any> { // 20220511 are events enabled/allowed on the training view or globally disabled?
    return this.http              // public api
      .post('/public/data/enabled', optionsBody);
  }

  getEventById(optionsBody: object): Observable<any> { // 20251206 public return of single event
    return this.http
      .post('/public/data/eventById', optionsBody);
  }

  getEvents(optionsBody: object): Observable<any> { // an array public events or promotion events that are valid to present to a user
    return this.http
      .post('/public/data/returnPublicEventsArray', optionsBody);
  }

  getEventsQuotaSparse(optionsBody: object): Observable<any> { // 20251202  
    return this.http              // public api
      .post('/public/data/eventByIdQuotaSparse', optionsBody);
  }

  passwordForgot(optionsBody: any): Observable<any> { // 20230612 //20261113 moved from SecureAPIService as this is a public endpoint
    return this.http              // public api
      .post('/api/v3/admin/passwordForgot', optionsBody);
  }

  passwordResetAfterToken(optionsBody: object): Observable<any> { // 20230612  
    return this.http              // public api
      .post('/public/save/passwordResetAfterToken', optionsBody);
  }

  // 20220531 caching responses for messages
  getMessage(tag: string, body: object, t = 300000): Observable<any> {
    // return a specific message: training || instructions || gdpr || EBT????
    // hardcoded to dbtasks messages task to allow for edits
    // caching of these messages are longterm static once downloaded to client
    // unlikely to change statistically, hard refresh will give latest anyway
    const cacheKey = `public:message:${this.cId}:${tag}`; //20261113 standardised on HttpContext caching instead of SharedReplayRefresh
    return this.http.post('/public/data/message/' + tag, body, {
      context: createCacheContext({ cacheKey, ttl: t }) //20261113
    });
  }

}
