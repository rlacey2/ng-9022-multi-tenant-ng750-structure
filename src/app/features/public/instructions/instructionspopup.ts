/* a container for t3_generic to present the cms preview

very similar to Draft but with reduced features

*/

import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
 
 
 
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { PublicAPIService } from '../../../core/services/public/public-api.service';
import { AppInitService } from '../../../core/auth/services/appinit/appinit.service';
import { SafePipe } from '../../../core/pipes/safe-pipe';
import { delay } from 'rxjs/operators';

 
@Component({
  standalone: true,
 
  selector: 'instructions-popup',
  templateUrl: './instructionspopup.html',
  providers: [Location, SafePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatIcon]
})

export class InstructionsPopupComponent implements OnInit, OnDestroy {


   private dialogRef = inject(MatDialogRef<InstructionsPopupComponent>)
   
  t55_messages:any = {};
 
  private publicAPIService = inject( PublicAPIService)
  private safePipe = inject( SafePipe)
  private appInit = inject( AppInitService)
  constructor(

  ) {
     
  } // constructor

  ngOnInit() {
   //console.log('ngOnInit');
    this.getMessage('instructions'); // this is cached for about 50 mintues on client side
 
  } // ngOnInit

  ngOnDestroy() {
 
  }

  getMessage(tag:any) { // 
    const filterBody =  { cId: this.appInit.cId, tag: tag } ;
    this.publicAPIService.getMessage(tag, filterBody, 3000000)
      .pipe(delay(0))
      .subscribe( { 
          next: (res:any) => {
            if ( res[0] ) {
                console.log('getMessage - ' + tag)
                this.t55_messages[tag] = this.safePipe.transform(res[0]['message']);
              }
            },
          error: (e:any)  => {
            //   this.messageTraining = ""; // html string
                this.t55_messages[tag] = "";
              } ,
              
          complete: () => {}
          
        } );
    }


    closeDialogX() {
    this.dialogRef.close({})
  }

}
