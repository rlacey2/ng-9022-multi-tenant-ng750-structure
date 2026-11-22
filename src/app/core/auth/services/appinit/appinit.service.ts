import { Injectable, Optional, SkipSelf, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpCacheService } from '../../../interceptors/http-cache.service';
import { environment as env } from '../../../../../environment/environment';
 

 
@Injectable({ providedIn: 'root' }) //20261113 removed stray @//Injectable comment above
export class AppInitService {

    public cId: string  ;

 
    
    // do not confuse appInit.appConfig['versiondb'] which is a ddatabase release and db row filter to appInit.appConfig['version'] from package.json
    public appConfig: any = {}; //20261113 default to empty object to prevent undefined property reads during early boot
    public authenticatedUserId: any
    public stripeOptions = { betas: ['payment_intent_beta_3'] }; // {} gave an error
    public company$ = new BehaviorSubject({});

    private http = inject(HttpClient)
    private httpCache = inject(HttpCacheService); //20261113
    private appInitServiceGuard = inject(AppInitService,   { skipSelf: true,  optional: true,  }  );
     
    constructor(
     //   @Optional() @SkipSelf() appInitServiceGuard?: AppInitService // singleton, so check if instantiated already

    ) {
        this.cId = ''
        if (this.appInitServiceGuard) {
         
          throw new Error('AppInitService is already loaded')
        }


        //  console.log('AppInitService->constructor()');
        /*
        console.log('check here for existing token');
        if (localStorage.getItem('accessToken') && localStorage.getItem('currentUser')) {
            // there is a token, use it to suggest authenticated
            console.log(localStorage.getItem('currentUser'));
        }
*/

        // const accessToken = localStorage.getItem('accessToken') || 'no token';
    }

    public get_cId(): string   {
        return this.cId;
    }

    private set_cId(cid: string): void {
        if (this.cId && this.cId !== cid) { //20261113 flush cache if cId ever changes
            this.httpCache.clear();
        }
        this.cId = cid;
    }


  // 1. Use a Signal instead of a Subject/Observable
  private _tenant = signal<any | null>(null);
  public readonly tenant = this._tenant.asReadonly();
  
 

  async init(): Promise<any> {
    try {
      // 2. Await the HTTP call cleanly
      const res: any = await firstValueFrom(this.http.get('/public/bycompany/cId'));

      this.set_cId(res['cId']); // use set_cId so cache clears if re-initialized
      
      // 3. Merge environment properties cleanly
    // do not confuse appInit.appConfig['versiondb'] which is a db row filter to appInit.appConfig['version'] from package.json

      this.appConfig = {
        ...res,
        isProd: env.production,
        envName: env.envName, 
        version: env.versions.app,
      };

      // Update the signal
      this._tenant.set(this.appConfig);

      // 4. Return the data so the caller receives it
      return this.appConfig;
      
    } catch (error) {
      console.error('Failed to initialize app config:', error);
      throw error; // Re-throw so Angular knows initialization failed
    }
  }



/*
    Init(): Promise<any> { 
      console.log('/public/bycompany/cId')
        // does not  work as advertised as other code runs before promise resolved ?
        //  console.log('decide the cId      cid.js supplies this data structure, app will crash without it');

        const cId$ = this.http.get('/public/bycompany/cId');    // this is an observable with asynch delay

        //var  cId$ = Observable.of('some string');

       //  firstValueFrom
       // Converts an observable to a promise by subscribing to the observable, and returning a promise that will resolve as 
       // soon as the first value arrives from the observable. The subscription will then be closed.
       
        const xxx = firstValueFrom(cId$) // the server side decides the cId based on url route
            .then( (res: any) => {
                //   console.log(res);
                this.set_cId(res['cId']); //20261113 use set_cId so cache clears if re-initialized
                this.appConfig = res;
                this.appConfig['isProd'] = env.production;
                this.appConfig['envName'] = env.envName;
                // do not confuse appInit.appConfig['versiondb'] which is a db row filter to appInit.appConfig['version'] from package.json
                this.appConfig['version'] = env.versions.app; // read from the package.json version
                console.log(this.cId)
                console.log("this.appConfig['jmbSystemURL']", this.appConfig['jmbSystemURL']);
                console.log('package version ', this.appConfig['version']);
                return this.company$.next(res);
            },
                error => console.log(error));
        return xxx;
    }

*/
}
