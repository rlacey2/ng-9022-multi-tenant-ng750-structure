import { Component, computed, DestroyRef, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, JsonPipe } from '@angular/common';
import { WorkspaceViewComponent } from '../../../shared/components/workspace-view/workspace-view';
import { TenantService } from '../../../core/http/tenant.service';
import { SafeHtml } from '@angular/platform-browser';
import { PublicAPIService } from '../../../core/services/api/public/public-api.service';
import { MessageResponseT55 } from '../../../core/models/message.response.model';
import { EventsPublicService } from '../../../shared/services/events-public.service';
import { EventUiStore } from './events.ui.store';
import { T3UiStore } from './t3.ui.store';
import { Router } from '@angular/router';
import { delay, EMPTY, Subject, Subscription, take } from 'rxjs';
 
import { FormField } from '@angular/forms/signals'; // Requires Angular v21+ (Signal Forms)
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';



@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule, WorkspaceViewComponent,
   // FormField,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  providers: [EventUiStore, T3UiStore, JsonPipe]
})

export class EventsComponent {

  // 1. SINGLE SOURCE OF TRUTH FOR EVENT ID
  // Automatically updates from: initial route, browser URL edits, or router.navigate()
  // Requires `withComponentInputBinding()` in app.config.ts
  eventId = input<string>(); // Note: URL params are always strings, not numbers

  // Optional: If you still have other route params (like promotion codes)
  // you can bind them as inputs too:
  promoCode = input<string>();

  private router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  private tenantService = inject(TenantService);
  private publicAPIService = inject(PublicAPIService)
  private eventsPublicService = inject(EventsPublicService)

  readonly ui = inject(EventUiStore);

  readonly t3ui = inject(T3UiStore); 

  msMessageRefreshTime = 300000; // 5 minutes unless hard requery for long-term static messages

  // 1. Signal holding a map of tag -> sanitized HTML
  readonly t55_messages = signal<Record<string, SafeHtml | string>>({});

  readonly showPublicView = computed(() =>
   // true && this.currentEventId() >  0
   this.currentEventId() >  0 &&  this.tenantService.isLiveSystem() && !this.tenantService.isAuthenticated()
  );

  /*
  // 1. Store only the source of truth
  readonly eventsList = signal<Event[]>([]);
  // 2. Derive the length automatically
  readonly eventsListLen = computed(() => this.eventsList().length);
*/


  // Automatically syncs whenever eventId() changes, AND can be overwritten via .set()
  currentEventId: any = linkedSignal(() => this.eventId());

  // Automatically re-runs whenever currentEventId() changes
  eventResource = rxResource({
    params: () => this.currentEventId(),
    stream: ({ params: id }) => {
      // Skip the HTTP call if URL is /events or /events/training (no ID)
      if (!id) return EMPTY;
      console.log(this.currentEventId() + "    to load")
      return EMPTY
      //   return this.eventsService.getEventById(id);
    }
  });


  // formMeta are business values used or required by the UI view to separate from some class this.* properties

  formMeta: any = { // techincal debt from angularjs version
    eventOffset: -1, eventId: '-1', eventsListLength: -1, paymentIntent: { id: null }, paymentIntentAmount: -1,
    showChoices: false,
    t3_meta: {} // this.ecT3CurrentService.initaliseT3Meta() // some values will need to be changed depending on parent
  };


  // later should these be signals?

  filterHardSince: any = { since: "-1" }

  eventsList2: any = [];
  eventsFormFilterFG: any // FormGroup;
  filterPipe: any;
  subs: Subscription[] = [];
  subsEvent: Subscription[] = [];
  killSubscriber = new Subject();
  error: any;   // is this used
  params: any = {};



  constructor() {
    console.log('events constructor: ' + this.tenantService.cId() + "   " + this.tenantService.isLiveSystem())
    effect(() => console.log(this.eventId()))



    effect(() => {
      const currentEvent = this.ui.selectedEvent();
      this.selectEvent(currentEvent);
    });

  }

  ngOnInit(): void {

    console.log(this.eventId()) // not available in constructor unless via effect
  }


  ngAfterViewInit(): void {
    // 2. Call on page load
    this.getMessage('training', this.msMessageRefreshTime); // let messages come from hard requery as changes are infrequent

    this.watch_events_list();

  }

  watch_events_list() {
    // note when in SPA mode i.e. selecting from the combo, these are not triggered as they fired on first load
    // they should fire again on manual change to url

    this.subs.push(
      this.eventsPublicService.ecListAvailableToPublic$ //
        .pipe(delay(0)) // no skip needed now as loaded aleady by the resolver
        .subscribe({
          next: (events: Array<Object>) => {
            this.eventsAvailable(events);   // only events within data
          },
          error: (error: any) => {
            this.error = error;
            this.eventsUnavailableError() // 20260501
          }
        }));

    console.log('code removed qwerty1')
    // 20220511 
    /*
    this.subs.push(

      this.eventsPublicService.ecEnabledPublic$
        .pipe(delay(0))
        .subscribe(
          {
            next: (flag: boolean) => {
              // console.log(flag)
              this.eventsPublicService.eventsEnabledToPublic.set(flag);

              if (flag === false) {
                this.formMeta.eventId = -1
              }
            },
            error: (error: any) => {
              this.eventsPublicService.eventsEnabledToPublic.set(false);
              this.error = error;
            }
          }
        )
    )
*/
  }

  selectEvent(newId: string | number): void {
    // Adds to Browser History
    this.router.navigate(['/events/training', newId], {
      queryParamsHandling: 'preserve' // keeps existing ?query=params if any
    });
    //   this.currentEventId.set(newId)
  }

  getMessage(tag: string, t: number): void {
    const filterBody = { cId: this.tenantService.cId(), tag };

    this.publicAPIService
      .getMessage(tag, filterBody, t)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (res) => {
          const data = res as MessageResponseT55[];
          const rawHtml = data?.[0]?.message;
          const safeValue = rawHtml ? this.sanitizer.bypassSecurityTrustHtml(rawHtml) : '';

          // 3. Immutably update the signal for this specific tag
          this.t55_messages.update((current) => ({
            ...current,
            [tag]: safeValue,
          }));
        },

        error: () => {
          this.t55_messages.update((current) => ({
            ...current,
            [tag]: '',
          }));
        },
      });
  }



  eventsAvailable(events: any) {
    //  alert('eventsAvailable = ' + events.length)
    //  this.eventsUnavailableError()
    // return
    // 20260501 more correctly we have an array that might be empty, and might not have the displayed event within it.
    // the araay is for combo selection which 99.99% users do not choose from or a just a header.
    // A promotion could be displayed, but not be in the array
    // so we might have to do some state tidyup if form previously populated
    // this is the array not the event that will populate the form
    // every /#/events/training requery should arrive here from url  
    // the array may have elements, but might not correspond to url eventId, which may be invalid due to not existing or some  other eventStatus value


    // OR NOT, array may be [] we have events from the server

    /*
    the combo array is always available as a data structure

    */
    // console.log('eventsAvailable: ', events);

    const eventsFound = events.length > 0

    if (!eventsFound) {
      this.ensureCorrectURL('') // let the user see what they entered allowing manual fix to input bar if relevant
    }

    this.ui.eventsAvailable.set(eventsFound);
    this.ui.eventsList.set(events);
    // computed this.formMeta.eventsListLength = events.length;

    this.t3ui.eventIdUnavailable.set(!eventsFound) // 20260501


    /* removed 20240924 as requested in past year to only display when given the id by email 
    if (this.formMeta.eventsListLength === 1) {
      this.offset$.next(0);
      this.eventId$.next(events[0].eventId); // rxjs only one choice so choose it and preload for user
     
    }
      */



    // 22 this.isLoading$.next(false);
    // this.isLoaded$.next(true);

  } // eventsAvailable from the server


  eventsUnavailableError() {
    // 20260501   400+ or 500+ path from server if event not public or promotion etc
    // this.ec.eventId = -1

    this.ui.eventsList.set([]);

    this.t3ui.eventIdUnavailable.set(true)

    this.ui.eventsAvailable.set(false);
    // the call
    //  reset in done on the way in else where this.resetView() this is for a single event, but this path is for the array

    // at this point we have an error and the rese
    // console.log(this.params.hash)
    // this.eventsEnabledToPublic$.next(false);

  }


  ensureCorrectURL(eId: string) {
    //   alert('ensureCorrectURL')
    // console.log('ensureCorrectURL')

    this.changeURL(this.params.hash)

  }

  changeURL(hash: any) {
    // console.log(hash)
    alert('fix this')
    /*
    setTimeout(() => {
      this.location.replaceState(hash);
    }, 10)
    */

  }

  showInstructions(options = {}) {
    return this.eventsPublicService.showInstructions({});
  }


    isFormDirty(options: any) { // this logic is called before some functions that will replace unsaved data  - wraps other functions on a dom click | selection change
    // isFormDiry is where programmer calls for a check and uses canDeactivate
    //console.log('isFormDirty')
  console.log('fix me pol2')
    /*
    if (this.canDeactivate()) {

      // @ts-ignore
      this[options.fn](options.params); // calling the callback function as safe to leave / refresh
    } else { // warning prompt
      const dialogConfirmRef = this.dialogService.dirtyWarning();
      dialogConfirmRef.afterClosed()
        .subscribe({
          next: value => {
            // console.log(`Dialog sent: ${value}`);
            if (value === true) {
              //  console.log('TRUE');
              // @ts-ignore
              this[options.fn](options.params); // calling the callback function as safe to leave / refresh
            } else {
              //  console.log('FALSE');
              if (options.fnCancelled) {
                // @ts-ignore
                this[options.fnCancelled](options.params);
              }
            }
          }
        }
        );
    }

    */

  } // isFormDirty



  onEventIdSelectionChange(event: MatSelectChange): void {
    const previous = this.ui.selectedEvent()
    const next = event.value;

    console.log("PUT DIRTY LOGIC IN HERE LATER FOR t3")
    if (false) {
      const confirmed = confirm(`You have unsaved changes. Switch to ${next}?`);
      
      if (!confirmed) {
        // Force the MatSelect UI back to the previous value
        event.source.writeValue(previous);
        return;
      }
    }

    // Only update the signal if clean or confirmed
    this.ui.selectedEvent.set(next)
    this.loadEventById( { eventId: next})
  }

 loadEventById(toLoad: any) {

    console.log('loadEventById')
    // from 20251206, direct call to server for the chosen event, not the array cache version

    // 20260429 discovered I was not applying same constraints as to the combo
    // i.e. bug, this code allowed closed event link from public user to present the input form
    // AMCSS/JMB 39th Annual Conference 2026 has a person after closed and excel download
 
    this.formMeta.t3_meta.eventIdUnavailable = false // 20260429
    this.eventsPublicService.loadEventById(toLoad)

      .pipe(take(1))
      .subscribe(
        {
          next: ec => {
           
             console.log(ec);
            ec = ec || {};
      
            this.t3ui.ec.set(ec)

         //   const hideSelectionCombo =  !this.ui.isAuthenticated() || this.liveSystem || this.params.isPromotion || (this.params.isChoice > 0) // 20230503 04

            const options = {
              filterOfferings: true,   // the public must always have filtered if quota reached etc.
              adminCRUD: { adminMode: false }, // NB
              hash: window.location.hash,// 20260501 for public side url etc

          //    hideSelection: hideSelectionCombo,
              ...this.params // sets isEBT and isPromotion and isChoice
            };
     //       this.ecT3CurrentService.setCurrentEventStatesReactive(ec, options, null);   // casades to watchers
          },
          error: (e: any) => {
            console.log(e);
            this.eventsUnavailableError()

            //this.ecT3CurrentService.setCurrentEventStatesReactive({}, options, null);   // casades to watchers

          },
          complete: () => { 
          
          }
        }
      )
  }





  ngOnDestroy() {
    // prevent memory leak when component destroyed

    this.killSubscriber.complete();
    this.subs.forEach(sub => sub.unsubscribe());
    this.subsEvent.forEach(sub => sub.unsubscribe());
  }

  /*
  override  canDeactivate(): Observable<boolean> | boolean { // route guard logic from interface etc and app.module

    if (this.t3FormFG) {
      return this.t3FormFG.pristine;
    }
    return true;
  }

  */
}
