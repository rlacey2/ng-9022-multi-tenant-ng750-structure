import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminSigninService {
  private http = inject(HttpClient);

  signinDelete(optionsBody: any): Observable<any> { // 20250315
    return this.http
      .post('/api/v3/admin/signin/signinDelete', optionsBody);
  }

  signinCheck(optionsBody: any): Observable<any> { // 20250220    // check on individual for the current 2 setups
    return this.http
      .post('/api/v3/admin/signin/signinCheck', optionsBody);  // notice post
  }

  signinManualSearch(optionsBody: any): Observable<any> { // 20250220    // check on individual for the window
    return this.http
      .post('/api/v3/admin/signin/signinManualSearch', optionsBody);  // notice post
  }

  signinRegister(optionsBody: any): Observable<any> { // 20250220
    return this.http
      .post('/api/v3/admin/signin/signinRegister', optionsBody);
  }

  signinRegisterUpdate(optionsBody: any): Observable<any> { // 20250220
    return this.http
      .post('/api/v3/admin/signin/signinRegisterUpdate', optionsBody);
  }

  signinActual(optionsBody: any): Observable<any> { // 20250220
    return this.http
      .post('/api/v3/admin/signin/signinActual', optionsBody);
  }

  listT12Attendees(optionsBody: any): Observable<any> { // 20251124
    return this.http
      .post('/api/v3/admin/resolving/listT12Attendees', optionsBody);
  }

  resolveT12Attendee(optionsBody: any): Observable<any> { // 20251125
    return this.http
      .post('/api/v3/admin/resolving/resolveT12Attendee', optionsBody);
  }
}
