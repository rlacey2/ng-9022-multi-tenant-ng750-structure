import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../../../shared/services/appinit/app-init.service';
import { createCacheContext } from '../../../shared/utils/http-cache.util';

//20261113 extracted from SecureAPIService
@Injectable({
  providedIn: 'root',
})
export class AdminBillingService {
  private http = inject(HttpClient);
  private appInit: any = inject(AppInitService);

  private get cId(): string { //20261113 dynamic getter prevents undefined cId if service loads before AppInitService finishes
    return this.appInit.get_cId();
  }

  // stripe reports
  // some of thes functions are stored in .serverAPICall 

  getStripeChargesList(optionsBody: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/reports/stripeListCharges', optionsBody);
  }

  getStripePaymentIntentsList(optionsBody: any): Observable<any> {
    // console.log(optionsBody)
    return this.http
      .post('/api/v3/admin/reports/stripeListPaymentIntents', optionsBody);
  }

  getStripeListPayouts(optionsBody: any): Observable<any> { // 20260524 
    return this.http
      .post('/api/v3/admin/reports/stripeListPayouts', optionsBody);
  }

  getStripeBalanceTransactionsList(optionsBody: any): Observable<any> { // 20260524 
    return this.http
      .post('/api/v3/admin/reports/stripeBalanceTransactionsList', optionsBody);
  }

  applyStripePayment(options: any): Observable<any> { // also present in Public API to allow stripe payments to work on both sides
    return this.http.post('/api/v3/admin/submitForPaymentV3PI', options);
  }

  applyStripeRefund(idCharge: string, options: any): Observable<any> { // also present in Public API to allow stripe payments to work on both sides
    return this.http.post('/api/v3/admin/stripe_charge_refund/' + idCharge, options);
  }

  chargeHistory(idCharge: string): Observable<any> { // also present in Public API to allow stripe payments to work on both sides
    return this.http.get('/api/v3/admin/charge_retrieve/' + idCharge);
  }

  getPaymentReport(optionsBody: any): Observable<any> {
    return this.http
      .post('/api/v3/admin/reports/paymentsListing', optionsBody);
  }

  getParentIdBalance(options: any): Observable<any> {  // may be orphaned as replaced by other code?
    return this.http
      .post('/api/v3/admin/parentIdBalance', options);
  }

  getParentIdTransactionDetails(options: any): Observable<any> {  // history of a particular pId i.e. submission
    //   console.log(options)
    const cacheKey = `admin:pIdDetails:${this.cId}:${options.pId}${options.delta}`;

    return this.http
      .post('/api/v3/admin/parentIdTransactionDetails', options,
        {   // 20260611
          context: createCacheContext({
            cacheKey: cacheKey,
            ttl: 10000,
            prefix_delete: 'admin:pIdDetails'
          }) // incase adjustments applied etc
        }
      );
  }

  adjustOpeningBalance(options: object): Observable<any> {
    return this.http.post('/api/v3/admin/adjustOpeningBalance', options);
  }

  applyTransaction(options: object): Observable<any> {
    return this.http.post('/api/v3/admin/applyTransaction', options);
  }
}
