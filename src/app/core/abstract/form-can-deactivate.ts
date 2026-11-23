// https://stackblitz.com/edit/angular-rgsa51?file=app%2Fuser-form%2Fuser-form.component.html

import { Observable, of } from 'rxjs';
import { ComponentCanDeactivate } from '../../shared/undecided/candeactivate/component-can-deactivate';
 
export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  // each component overrides with local function
  override canDeactivate(): Observable<boolean> | boolean { // route guard logic from interface etc and app.module
   // console.log('canDeactivate ???')
    /*
   if (this.form) {
     return this.form.submitted || !this.form.dirty;
   } else {
     return true;
   }
   */
    return true;
  }
}
