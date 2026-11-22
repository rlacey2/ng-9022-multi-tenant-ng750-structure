 
/*

SEARCHING RELATED ONLY OR SHOULD BE

Return the public events for the public view, to allow user to choose an event

may need to take into consideration promotion and ebt backdoors

*/

import { Injectable , inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';


 
 
import { AppInitService } from '../../core/auth/services/appinit/appinit.service';
import { PublicAPIService } from '../../core/services/public/public-api.service';
import { BLOCKING_FULL_SCREEN_DIALOG_OPTIONS } from '../constants/constants';
import { InstructionsPopupComponent } from '../../features/public/instructions/instructionspopup';

@Injectable({ providedIn: 'root' })
export class EventsPublicService {



  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // list that can be displayed on events dropdown
  ecListAvailableToPublic_Source$: any = new BehaviorSubject([
    /*
    {  cId: "jmbtest", eventId: 481, model_type: "Workshop", name: "Annual Conference 2025", version: "ng750"
  }
   */
  ]); // need as array for display logic
  // ecListAvailableToPublic_Source$: BehaviorSubject<Object> = new BehaviorSubject({}); // need as array for display logic
  ecListAvailableToPublic$ = this.ecListAvailableToPublic_Source$.asObservable(); // hide behaviour features from client

  ecEnabledPublic_Source$: BehaviorSubject<boolean> = new BehaviorSubject(true); // assume enabled unless server sends false
  ecEnabledPublic$ = this.ecEnabledPublic_Source$.asObservable();

  ecListLength = 0;
  ecMap: any;

  readonly blockingFullScreenDialogOptions = BLOCKING_FULL_SCREEN_DIALOG_OPTIONS

  private singletonGuard = inject(EventsPublicService, { skipSelf: true, optional: true, });


    private appInit = inject(AppInitService)
    private publicAPIService = inject(PublicAPIService)
    private matDialog =inject(MatDialog)


  constructor(
 
  ) {
    if (this.singletonGuard) {
      throw new Error('EventsPublicService is already loaded')
    }

  }

  loadEventById(options: any) {
    /* 
    20251206 decouple the events array set from the selection
    now the combo selection triggers a fresh server call, which means the latest state of play is return
    for the event
    */
    return this.publicAPIService.getEventById(options)

  }

  loadEvents(filters: any) {
    // there are two api calls here, the second one returns an array of events, that are filter relevant and may be empty
    // sets global variable on availabilty of training events
    // AND returns an observable that yields the array of public events
    // from the server   : Observable<any>
     console.log('loadEvents()');
    this.isLoading$.next(true);

    // 20220509 this is new to see if the public events/training view is enabled

    // this is the global admin related flag
    const enabledToPublic = this.publicAPIService.getEventsEnabled({ filter: { cId: this.appInit.cId } }) // no version on t99 table
      .pipe(take(1))
      .subscribe(
        {
          next: (result: any) => {
            // console.log(result);
            result = result || { json_value: {} };

            // x = {id: 139, cId: 'jmbtest', name: 'eventsEnabled', json_value: '{enabled:false}'}
            let x = JSON.parse(result['json_value']);
            if (x['enabled'] === false) {
              console.log('enabledToPublic = false')
              // displays to the public:    Locked for administration tasks.
              this.ecEnabledPublic_Source$.next(false);
            }
            else {
              this.ecEnabledPublic_Source$.next(true); // always enabled unless explicitly false
            }
          },
          error: (e : any) => {
            console.log(e);
          },
          complete: () => { }
   
        }

      ) // enabledToPublic

    /*
        console.log('filterObj 20230520 NB for loads')
       let filterObj = {filter : { ...iFilters, ... { cId: this.appInit.cId } }}
    */

    // do not confuse appInit.appConfig['versiondb'] which is a db row filter to appInit.appConfig['version'] from package.json
    let versiondb = this.appInit.appConfig['versiondb'] || "ng750" // 20220528 to ignore v1 ng1 events
    const filterBody = { filter: { cId: this.appInit.cId, versiondb: versiondb, ...filters } };
  
    // these are the events, if any that are availiable
    const events$ = this.publicAPIService.getEvents(filterBody) // calls a post.
      .pipe(
        map((dataFromApi: any) => {
        //  console.log('events load success');
      //    console.log(dataFromApi.records)
          this.ecMap = this.arrayToObject(dataFromApi.records, 'eventId'); // allows access via eventId
          //   console.log('ecMap ', this.ecMap);
          this.ecListLength = dataFromApi.records.length;
          // 20250426b 
          // one of the two inputs to mustDisplayEvent$ i.e. the events, the other is the offset from combo or logic
          // having both means the ui via mustDisplayEvent$ trigger the logic that will 
          // eventually cascade to the rendering of an event on the training view
          this.ecListAvailableToPublic_Source$.next(dataFromApi.records); // used by the select logic and array needed for ordering
          this.isLoading$.next(false);
          return dataFromApi
        }
        ), // this line is needed

        catchError((err) => {
          console.log('events load failure. is this preventing the url input remembering the actual call url');
          this.ecListLength = 0;
          this.isLoading$.next(false);
          this.ecListAvailableToPublic_Source$.next([]);

           return of(null); // ✅ DO NOT rethrow
         // return throwError(() => 'Error getting event data these filters')
        }) // used by a resolver
        //  catchError((err) => throwError('Error getting events') // used by a resolver
      );


    return events$; // used by the route resolver
  } // loadEvents()

  findOffsetInArray(eventId: any) { // for the ui select
    let offset = -1;
    if (this.ecListLength > 0) {
      const eventIdStr = eventId.toString();
      offset = this.ecListAvailableToPublic_Source$.getValue().findIndex((ec: any) => {
        // return ec['eventId'].toString() === this.eventIdRoute.toString();
        return ec['eventId'].toString() === eventIdStr;
      });
    }
    return offset;
  }

  setCurrentEvent(eventId: string) { // cascasde back to the caller that subscribes
    console.log('setCurrentEvent: ', eventId);
    const ec = this.ecMap[eventId];
    console.log(ec);
  }

  // https://medium.com/dailyjs/rewriting-javascript-converting-an-array-of-objects-to-an-object-ec579cafbfc7
  arrayToObject = (array: any, keyField: string) =>
    array.reduce((obj: any, item: any) => {
      obj[item[keyField]] = item;
      return obj;
    }, {})

  showInstructions(options = {}) {
    return this.matDialog.open(InstructionsPopupComponent, {
      data: options,
      ...this.blockingFullScreenDialogOptions
    });
  }



} // EventsPublicService
