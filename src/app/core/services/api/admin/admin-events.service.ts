import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminEventsService {
  private http = inject(HttpClient);

  eventsList(optionsBody: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/returnAdminEventsArray', optionsBody);
  }

  getEventById(optionsBody: any): Observable<any> {  // return a single event based on eventId
    // console.log('getEvent');
    return this.http
      .get('/api/v3/admin/events/' + optionsBody.eventId);
  }

  saveEC(dataToSave: any, options = {}): Observable<any> {
    return this.http
      .put('/api/v3/admin/events', dataToSave, options);
  }

  deleteEC(eventId: string): Observable<any> {
    return this.http
      .delete('/api/v3/admin/events/' + eventId, {});
  }

  fixTypoECData(options: any): Observable<any> { // cms 10 action to fix typos discovered in choice text allowed go live
    return this.http
      .put('/api/v3/admin/normalise_t14_choice', options);
  }

  purgeEventAttendeeData(options: any): Observable<any> {
    return this.http.delete('/api/v3/admin/eventsData/' + options.eventId);
  }

  getAttendees(optionsBody: any): Observable<any> {  // for the admin grid view  
    return this.http
      .post('/api/v3/admin/events/attendeesList', optionsBody);
  }

  getEventAttendeesCount(optionsBody: any): Observable<any> {  // for the admin grid view  
    return this.http
      .post('/api/v3/admin/events/eventattendeescount', optionsBody);
  }

  getAttendeesForReportByFilters(optionsBody: any): Observable<any> {  // for the admin grid view  
    // the endpoint may differ based on the data set required
    console.log(optionsBody);
    return this.http
      .post('/api/v3/admin/event/listAttendees', optionsBody);
  }

  getContactEmails(optionsBody: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/event/listContactEmails', optionsBody);
  }

  getGroupByChoiceTotals(optionsBody: any): Observable<any> {  // for the admin grid view   
    return this.http
      .post('/api/v3/admin/event/groupByChoice', optionsBody);
  }

  getGroupByOrganisations(optionsBody: any): Observable<any> {  // for the admin grid view   
    return this.http
      .post('/api/v3/admin/event/groupByOrganisations', optionsBody);
  }

  getNoDataOrganisations(optionsBody: any): Observable<any> {  // for the admin grid view  
    // the endpoint may differ based on the data set required
    return this.http
      .post('/api/v3/admin/event/NoDataOrganisations', optionsBody);
  }

  parentIdReassembleToEdit(options: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/eventSubmissionEditReassemble', options);
  }

  deleteParentId(options: any): Observable<any> {
    return this.http
      .delete('/api/v3/admin/deleteParentId/' + options.parentId, {});
  }

  properName(options: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/attendeeProperNames', options);
  }

  adminCRUD(action: string, dataToSave: any): Observable<any> {
    //console.log(dataToSave.attendees)
    switch (action) {
      case 'update':
        return this.http.post('/api/v3/admin/submissionadmineditsave', dataToSave);
      default:
        // case 'create': 
        return this.http.post('/api/v3/admin/submissionadminadd', dataToSave);
    }
  }

  eventRequestById(options: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/reports/eventRequestById', options);
  }
}
