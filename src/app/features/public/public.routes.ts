import { inject } from '@angular/core';
import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { EventsResolver } from '../../shared/resolvers/events-resolver.service';

export function eventsMatcher(segments: UrlSegment[]): UrlMatchResult | null { // for /#/events
  // reports in segements the values after /#/
  // so if it ends in /#/ no values in UrlSegment
  //                   0       1      2
  //    case 1)   /#/events
  //    case 2)   /#/events/training
  //    case 3)   /#/events/training/285
  //    case 3b)  /#/events/training/285/choice  // 20230503
  //    case 4)   /#/events/training/285/promotion/ggg
  //    case 5)   /#/events/training/285/ebt/sss
  //    case 6)   /#/events + error


    console.log('eventsMatcher outer', segments); // fires multiple times

  if (segments.length === 0) { // 20260102 // case 7 
    return { consumed: segments, posParams: {} };
  }

  if (segments[0].path !== 'events') {
    return null;
  }

  if (segments.length === 1 || segments[1].path !== 'training') { // case 1 + 
    return { consumed: segments, posParams: {} };
  }

  if (segments.length === 2) { // #/events/training now confirmed
    return { consumed: segments, posParams: {} };
  }

  if (/^[1-9][0-9]*$/.test(segments[2].path)) {
    const eventId = segments[2];

    if (segments.length === 3) {  // segments[2] must be an eventId
      return { consumed: segments, posParams: { eventId } };
    }
    if (segments.length === 4 && segments[3].path === 'choice') {
      return { consumed: segments, posParams: { eventId, choice: segments[3] } };
    }
    // promotion or ebt
    if (segments.length === 5 && segments[3].path === 'promotion') {
      return { consumed: segments, posParams: { eventId, promotionCode: segments[4] } };
    }
    if (segments.length === 5 && segments[3].path === 'ebt') {
      return { consumed: segments, posParams: { eventId, ebtCode: segments[4] } };
    }
    return null;
  }

  return {
    consumed: [segments[0], segments[1]],
    posParams: {},
  };


/*

  if (segments.length === 0) {
    
    return { 
      consumed: segments,
      posParams: {},
    };
  }

  if (segments.length > 0 && segments[0].path.match(/events/gm)) {   //    #/events ... i.e. one of the cases 
    // will be called for other like status but allow fall to their own resolver
    // console.log('eventsMatcher', segments); // fires multiple times
    //  console.log(UrlSegment.toString());
    if (segments.length === 1) {
      return { // case 1
        consumed: segments,
        posParams: {},
      };
    }

    else
      // negation here
      if (!segments[1].path.match(/training/gm)) { // 2nd segment #/events/???? but an error
        return { // case 6
          consumed: segments,
          posParams: {},
        };
      } else { // #/events/training now confirmed
        if (segments.length === 2) {
          return { // case 2
            consumed: segments,
            posParams: {},
          };
        } else
          if (segments[2].path.match(/^[1-9][0-9]*$/)) {
            // segments[2] must be an eventId
            if (segments.length === 3) {
              return { // case 3
                consumed: segments,
                posParams: { eventId: segments[2] },
              };
            } else
              if (segments.length === 4) { // 20230503 choice specific

                if (segments[3].path.match(/choice/gm)) {

                  return { // case 3b
                    consumed: segments,
                    posParams: { eventId: segments[2], choice: segments[2] }
                  };
                }

              }
              else
                if (segments.length === 5) { // promotion or ebt

                  if (segments[3].path.match(/promotion/gm)) {

                    return { // case 4
                      consumed: segments,
                      posParams: { eventId: segments[2], promotionCode: segments[4] }
                    };
                  }
                  if (segments[3].path.match(/ebt/gm)) {
                    return { // case 5
                      consumed: segments,
                      posParams: { eventId: segments[2], ebtCode: segments[4] }
                    };
                  }
                }
          } else { // make it a case 2 to stay on the view
            return { // case 2
              consumed: [segments[0], segments[1]], // segments,
              posParams: {}
            };
          }
      }
    return <UrlMatchResult>(null as any);
  }
  return <UrlMatchResult>(null as any);
  */
}
 

export const PUBLIC_ROUTES: Routes = [ 
 // { path: '', redirectTo: 'events', pathMatch: 'full' },
 // { path: 'events', loadComponent: () => import('./events/events').then(m => m.EventsComponent) },

  { 
    path: '', 
    redirectTo: 'events', 
    pathMatch: 'full' 
  },
  { // events via the eventsMatcher
    // Note: Do NOT include both 'path' and 'matcher' on the same route—matcher replaces path
    matcher: eventsMatcher,
    loadComponent: () => import('./events/events').then(m => m.EventsComponent),
    title: 'Events',
 /*   
    canDeactivate: [
      (component, currentRoute, currentState, nextState) =>
        inject(CanDeactivateGuard).canDeactivate(component, currentRoute, currentState, nextState)
    ]
*/

    resolve: { 
      eventsLoaded: EventsResolver 
    },
    runGuardsAndResolvers: 'always',
  }, 







  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPasswordComponent) }
];


 ;