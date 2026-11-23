// used in router to check if leaving a dirty form and prompts the user to confirrm
import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { ComponentCanDeactivate } from './component-can-deactivate';
import { Observable } from 'rxjs';
import { UNSAVED_CHANGES } from '../../../shared/constants/constants';
//import { DialogService } from '../dialog.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard
  implements CanDeactivate<ComponentCanDeactivate> {
  readonly unsaved_changes = UNSAVED_CHANGES;

  constructor(
   // private dialogService: DialogService
  ) {

  }

  canDeactivate(
    component: ComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
 // console.log('canDeactivate');
    if (component && !component.canDeactivate()) { // the local component indicator if the view/component is dirty
     //  return this.promptUser() 
     alert("fix this aaaa2")
      // return this.promptUser2() 
    }
    return true;
  }

  promptUser2() {
    // return of(false);
alert("fix this aaaa1")
  //  return this.dialogService.dirtyWarning().afterClosed();
  
  }

  promptUser() {
    if (
      confirm(this.unsaved_changes)
    ) {
      return true;
    } else {
    //  console.log('cancelled');
      return false;
    }
  }
}
