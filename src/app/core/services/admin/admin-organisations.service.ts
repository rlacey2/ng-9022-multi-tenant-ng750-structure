import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminOrganisationsService {
  private http = inject(HttpClient);
  private readonly endPointOrganisations = '/api/v3/admin/organisation';

  updateOrganisation(options: any): Observable<any> {
    if (options.pkey) // update alternate primary key
    {
      //  this end point is not working for any crud  but it is working on the deployed version    check the organisations file and indexed.js????
      //  console.log(options);
      console.log(this.endPointOrganisations + '/' + options.cId + '/' + options.pkey);
      return this.http.put(this.endPointOrganisations + '/' + options.cId + '/' + options.pkey, options);
    }
    else // insert/append this generates a primary key
    {
      return this.http.post(this.endPointOrganisations + '/' + options.cId, options);
    }
  }

  deleteOrganisation(options: any): Observable<any> {
    return this.http.delete(this.endPointOrganisations + '/' + options.cId + '/' + options.pkey);
  }

  getOrganisation(options: any): Observable<any> { // 20240827 based on the orgId
    return this.http.get(this.endPointOrganisations + '/' + options.cId + '/' + options.id);
  }

  crmAlignment(optionsBody: any): Observable<Object> { // 20260926
    return this.http
      .post('/api/v3/admin/organisations/crmAlignment', optionsBody);
  }

  getOrganisationsDuplicates(optionsBody: any): Observable<any> {  // for the admin grid view 20201014
    return this.http
      .post('/api/v3/admin/event/organisationDuplicates', optionsBody); // GRID VIEW
  }

  getOrganisationsDuplicatesReport(optionsBody: any): Observable<any> {  // for the levy
    return this.http
      .post('/api/v3/admin/event/levyOrganisationDuplicatesReport', optionsBody);
  }

  getLevyOrganisations(optionsBody: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/event/levyOrganisationsOverallStatus', optionsBody);
  }
}
