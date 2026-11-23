import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AppInitService } from '../../../auth/services/appinit/appinit.service';
 
//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);
  private appInit: any = inject(AppInitService);

  private get cId(): string { //20261113 dynamic getter prevents undefined cId if service loads before AppInitService finishes
    return this.appInit.get_cId();
  }

  usersList(optionsBody: any): Observable<any> {
    // console.log('usersList ', optionsBody);
    return this.http
      .post('/api/v3/admin/users', optionsBody);
  }

  getUser(optionsBody: any): Observable<any> {  // return a single event based on eventId
    //   console.log('getUser');
    return this.http
      .get('/api/v3/admin/users/user/' + optionsBody.eventId);
  }

  updateUser(optionsBody: any): Observable<any> {  // return a single event based on eventId
    //   console.log('updateUser');
    return this.http.post('/api/v3/admin/users/user', optionsBody);
  }

  deleteUser(UserId: String): Observable<any> {  // return a single event based on eventId
    //   console.log('deleteUser');
    return this.http
      .delete('/api/v3/admin/users/user/' + UserId);
  }

  getUsersAccountDetails(userId: any): Observable<any> {
    return this.http.get('/api/v3/admin/user/' + userId + '/' + this.cId);
  }

  changePasswordSomeone(User: any): Observable<any> { // called by an admin
    return this.http
      .post('/api/v3/admin/changePasswordSomeone', { 'userValues': User });
  }

  changePasswordOwn(User: any): Observable<any> { // called by a user themselves
    return this.http
      .post('/api/v3/admin/changePasswordOwn', { 'userValues': User });
  }

  // 20250223 to force login if required on protected admin views
  checkAuthenticated(): Observable<any> {
    console.log('checkAuthenticated()');
    return this.http
      .post('/api/v3/admin/authenticated', { 'cId': this.cId }).pipe(
        shareReplay({ bufferSize: 1, refCount: true, windowTime: 2000 })
      );
  }
}
