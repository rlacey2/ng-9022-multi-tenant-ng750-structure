// fetches the training data before completing the route

// this is before you successfully route to the component, check for data
// ? allow on page and display appropriate UI?
// inother words why prevent landing on page and them warn

// handles promotion logic also

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EventsPublicService } from '../services/events-public.service';


@Injectable({
  providedIn: 'root'
})

// each time the /events/training route is activated come here and do some processing
// which will call the code to filter relevant events and tidy up the state for presentation
// export class EventsResolver implements Resolve<any> {
export class EventsResolver {

  private eventsPublicService = inject(EventsPublicService)
  constructor(
   
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   // only used ont the /events/training route
   //   console.log('EventsResolver ', route.paramMap);

    const filter:any = {};

    const eventId = route.paramMap.get('eventId');
    if (eventId) {
      filter['eventId'] = eventId;
      //    console.log('eventId = ', this.params.eventId);
      const promotionCode = route.paramMap.get('promotionCode') || undefined;
      if (promotionCode) {
        // console.log('promotionId code = ', promotionCode);
        filter['promotionCode'] = promotionCode;
      }
      /* not relevant here
      const ebtCode = route.paramMap.get('ebtCode') || undefined;
      if (ebtCode) {
        console.log('ebtId code = ', ebtCode);
      }
     
      const choice = route.paramMap.get('choice') || undefined;
      filter['choice'] = choice;
 */
    }

    // we want this array on reaching the events view
    // also rerun for
    // console.log('event resolover')
    // if this array is [] empty then the user gets a red warning message etc
    return this.eventsPublicService.loadEvents(filter);  // an observable with array of public events

  }
}
