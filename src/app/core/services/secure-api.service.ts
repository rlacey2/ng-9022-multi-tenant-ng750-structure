// common tags for search:
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
 
import { PublicAPIService } from './public/public-api.service';
import { AdminBillingService } from './admin/admin-billing.service';
import { AdminDbTasksService } from './admin/admin-db-tasks.service';
import { AdminEmailService } from './admin/admin-email.service';
import { AdminEventsService } from './admin/admin-events.service';
import { AdminOrganisationsService } from './admin/admin-organisations.service';
import { AdminReportsStatusService } from './admin/admin-reports-status.service';
import { AdminSigninService } from './admin/admin-signin.service';
import { AdminUsersService } from './admin/admin-users.service';
import { AppInitService } from '../auth/services/appinit/appinit.service';

/**
 * @deprecated //20261113 Thin delegation facade forwarding to domain services.
 * Migrate components to inject specific domain services directly (e.g., AdminEventsService, AdminBillingService).
 */
@Injectable(
  {
    providedIn: 'root',  //20250903  this solved loading twice rather than putting in authenticatedModule providers
  }
)
export class SecureAPIService {

  private appInit: any = inject(AppInitService);
  private publicApi = inject(PublicAPIService); //20261113

  private billing = inject(AdminBillingService); //20261113
  private dbTasks = inject(AdminDbTasksService); //20261113
  private email = inject(AdminEmailService); //20261113
  private events = inject(AdminEventsService); //20261113
  private orgs = inject(AdminOrganisationsService); //20261113
  private reports = inject(AdminReportsStatusService); //20261113
  private signin = inject(AdminSigninService); //20261113
  private users = inject(AdminUsersService); //20261113

  //20261113 dynamic getters kept temporarily in case legacy components read these properties directly
  get cId(): string {
    return this.appInit.get_cId();
  }

  get versiondb(): string {
    return this.appInit.appConfig?.['versiondb'] || 'ng750';
  }

  constructor() {
    this.appInit['statusVisited'] = true; // 20240504 to flag to public side if SAFEPIPE is availabe for jsonio
  }

  // --- Moved to PublicAPIService --- //20261113
  passwordForgot(optionsBody: any) { return this.publicApi.passwordForgot(optionsBody); }

  // --- AdminEventsService --- //20261113
  eventsList(optionsBody: any): Observable<any> { return this.events.eventsList(optionsBody); }
  getEventById(optionsBody: any): Observable<any> { return this.events.getEventById(optionsBody); }
  saveEC(dataToSave: any, options = {}) { return this.events.saveEC(dataToSave, options); }
  deleteEC(eventId: string) { return this.events.deleteEC(eventId); }
  fixTypoECData(options: any) { return this.events.fixTypoECData(options); }
  purgeEventAttendeeData(options: any) { return this.events.purgeEventAttendeeData(options); }
  getAttendees(optionsBody: any): Observable<any> { return this.events.getAttendees(optionsBody); }
  getEventAttendeesCount(optionsBody: any): Observable<any> { return this.events.getEventAttendeesCount(optionsBody); }
  getAttendeesForReportByFilters(optionsBody: any): Observable<any> { return this.events.getAttendeesForReportByFilters(optionsBody); }
  getContactEmails(optionsBody: any) { return this.events.getContactEmails(optionsBody); }
  getGroupByChoiceTotals(optionsBody: any): Observable<any> { return this.events.getGroupByChoiceTotals(optionsBody); }
  getGroupByOrganisations(optionsBody: any): Observable<any> { return this.events.getGroupByOrganisations(optionsBody); }
  getNoDataOrganisations(optionsBody: any): Observable<any> { return this.events.getNoDataOrganisations(optionsBody); }
  parentIdReassembleToEdit(options: any) { return this.events.parentIdReassembleToEdit(options); }
  deleteParentId(options: any) { return this.events.deleteParentId(options); }
  properName(options: any) { return this.events.properName(options); }
  adminCRUD(action: string, dataToSave: any) { return this.events.adminCRUD(action, dataToSave); }
  eventRequestById(options: any) { return this.events.eventRequestById(options); }

  // --- AdminBillingService --- //20261113
  getStripeChargesList(optionsBody: any) { return this.billing.getStripeChargesList(optionsBody); }
  getStripePaymentIntentsList(optionsBody: any) { return this.billing.getStripePaymentIntentsList(optionsBody); }
  getStripeListPayouts(optionsBody: any) { return this.billing.getStripeListPayouts(optionsBody); }
  getStripeBalanceTransactionsList(optionsBody: any) { return this.billing.getStripeBalanceTransactionsList(optionsBody); }
  applyStripePayment(options: any) { return this.billing.applyStripePayment(options); }
  applyStripeRefund(idCharge: string, options: any) { return this.billing.applyStripeRefund(idCharge, options); }
  chargeHistory(idCharge: string) { return this.billing.chargeHistory(idCharge); }
  getPaymentReport(optionsBody: any): Observable<any> { return this.billing.getPaymentReport(optionsBody); }
  getParentIdBalance(options: any) { return this.billing.getParentIdBalance(options); }
  getParentIdTransactionDetails(options: any) { return this.billing.getParentIdTransactionDetails(options); }
  adjustOpeningBalance(options: object) { return this.billing.adjustOpeningBalance(options); }
  applyTransaction(options: object) { return this.billing.applyTransaction(options); }

  // --- AdminEmailService --- //20261113
  emailSend(mailOptions: any) { return this.email.emailSend(mailOptions); }
  emailReassembleForResend(mailOptions: any) { return this.email.emailReassembleForResend(mailOptions); }
  emailFragmentTest(optionsBody: any) { return this.email.emailFragmentTest(optionsBody); }
  testEmailCalendar(mailOptions: any) { return this.email.testEmailCalendar(mailOptions); }
  reminderEmails(optionsBody: any): Observable<Object> { return this.email.reminderEmails(optionsBody); }
  reminderHistory(optionsBody: any): Observable<any> { return this.email.reminderHistory(optionsBody); }
  undeliveredMatchWith_t12(options: any): Observable<any> { return this.email.undeliveredMatchWith_t12(options); }
  fetchEmailAddresses(options: any) { return this.email.fetchEmailAddresses(options); }

  // --- AdminOrganisationsService --- //20261113
  updateOrganisation(options: any) { return this.orgs.updateOrganisation(options); }
  deleteOrganisation(options: any) { return this.orgs.deleteOrganisation(options); }
  getOrganisation(options: any) { return this.orgs.getOrganisation(options); }
  crmAlignment(optionsBody: any): Observable<Object> { return this.orgs.crmAlignment(optionsBody); }
  getOrganisationsDuplicates(optionsBody: any): Observable<any> { return this.orgs.getOrganisationsDuplicates(optionsBody); }
  getOrganisationsDuplicatesReport(optionsBody: any): Observable<any> { return this.orgs.getOrganisationsDuplicatesReport(optionsBody); }
  getLevyOrganisations(optionsBody: any): Observable<any> { return this.orgs.getLevyOrganisations(optionsBody); }

  // --- AdminSigninService --- //20261113
  signinDelete(optionsBody: any): Observable<any> { return this.signin.signinDelete(optionsBody); }
  signinCheck(optionsBody: any): Observable<any> { return this.signin.signinCheck(optionsBody); }
  signinManualSearch(optionsBody: any): Observable<any> { return this.signin.signinManualSearch(optionsBody); }
  signinRegister(optionsBody: any): Observable<any> { return this.signin.signinRegister(optionsBody); }
  signinRegisterUpdate(optionsBody: any): Observable<any> { return this.signin.signinRegisterUpdate(optionsBody); }
  signinActual(optionsBody: any): Observable<any> { return this.signin.signinActual(optionsBody); }
  listT12Attendees(optionsBody: any): Observable<any> { return this.signin.listT12Attendees(optionsBody); }
  resolveT12Attendee(optionsBody: any): Observable<any> { return this.signin.resolveT12Attendee(optionsBody); }

  // --- AdminUsersService --- //20261113
  usersList(optionsBody: any): Observable<any> { return this.users.usersList(optionsBody); }
  getUser(optionsBody: any): Observable<any> { return this.users.getUser(optionsBody); }
  updateUser(optionsBody: any): Observable<any> { return this.users.updateUser(optionsBody); }
  deleteUser(UserId: String): Observable<any> { return this.users.deleteUser(UserId); }
  getUsersAccountDetails(userId: any) { return this.users.getUsersAccountDetails(userId); }
  changePasswordSomeone(User: any) { return this.users.changePasswordSomeone(User); }
  changePasswordOwn(User: any) { return this.users.changePasswordOwn(User); }
  checkAuthenticated(): Observable<any> { return this.users.checkAuthenticated(); }

  // --- AdminReportsStatusService --- //20261113
  getServerInfo(): Observable<any> { return this.reports.getServerInfo(); }
  getEventChoiceStatus(): Observable<any> { return this.reports.getEventChoiceStatus(); }
  getStatusArchivedWithData(): Observable<any> { return this.reports.getStatusArchivedWithData(); }
  getEventTrace(optionsBody: any): Observable<any> { return this.reports.getEventTrace(optionsBody); }
  getCustomReports(eventId: string): Observable<any> { return this.reports.getCustomReports(eventId); }
  saveCustomReports(eventId: string, toSave: Object): Observable<any> { return this.reports.saveCustomReports(eventId, toSave); }
  getAdminGridData(refreshEndPoint: string, optionsBody: any): Observable<any> { return this.reports.getAdminGridData(refreshEndPoint, optionsBody); }
  viewCall(options: any) { return this.reports.viewCall(options); }

  // --- AdminDbTasksService --- //20261113
  eventsListAll(options: any) { return this.dbTasks.eventsListAll(options); }
  get_t99_key_name(name: string) { return this.dbTasks.get_t99_key_name(name); }
  save_t99_key_name(keyData: object) { return this.dbTasks.save_t99_key_name(keyData); }
  getMessage(tag: string) { return this.dbTasks.getMessage(tag); }
  saveMessage(messageData: string) { return this.dbTasks.saveMessage(messageData); }
  invalidateTokens(options: any) { return this.dbTasks.invalidateTokens(options); }
}
