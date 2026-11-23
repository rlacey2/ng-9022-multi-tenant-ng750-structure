// https://stackblitz.com/edit/angular-rgsa51?file=app%2Fuser-form%2Fuser-form.component.html

import { HostListener, Directive } from '@angular/core';
import { Observable, of } from 'rxjs';

@Directive()
export abstract class ComponentCanDeactivate {

    abstract canDeactivate(): Observable<boolean> | boolean | boolean; // implemented in hard class instance i.e. the component

    @HostListener('window:beforeunload', ['$event']) // The handler will be automatically removed in ngOnDestroy.
    unloadNotification($event: any){ // catches leaving the app i.e. closing the app in the browser
        console.log('leaving the app');
        // https://stackoverflow.com/questions/51993603/how-do-i-set-the-event-returnvalue-property-to-null-in-typescript
        if (!this.canDeactivate()) {
            $event.returnValue = true; // appears no difference when false?
        }
    }

}


