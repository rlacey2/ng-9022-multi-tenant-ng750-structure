import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EMPTY, firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { AuthResponse, UserProfile, LoginCredentials } from '../models/auth.models';
import { TenantService } from '../../http/tenant.service';
import { User } from '../../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private readonly http = inject(HttpClient);

 private tenantService = inject(TenantService);
 // private publicAPIService = inject(PublicAPIService)

  
  private readonly TIMEOUT_MS = 15 * 60 * 1000; 

  private BASE_URL = '';
  cId: any = ""
  

  

  readonly currentUser = signal<UserProfile | null>(this.initializeUserFromStorage());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  private accessToken: string | null = localStorage.getItem('access_token');


  private currentUserSignal = signal<UserProfile | null>(null);
  private tokenSignal = signal<string | null>(null);



  constructor() {
    console.log('tokenSignal ???????')
    this.listenToCrossTabEvents();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  updateLastActivityTimestamp(): void {
    localStorage.setItem('last_activity_timestamp', Date.now().toString());
  }

  async login(credentials: LoginCredentials): Promise<Observable<AuthResponse>> {
console.log('login')

  try {
    const response = await firstValueFrom(this.login2({ Username: credentials.email, password: credentials.password }));
    console.log('Logged in:', response);
    let userData = response
    this.handleAuthentication({ UserId: userData.user.UserId, token: userData.token, email: credentials.email, role: userData.user.role })
    // { UserId: userData.user.UserId, token: userData.token, email: payload.email, role: userData.user.role }
    return response
  } catch (err) {
    console.error('Login error:', err);
     return EMPTY
  }

 
/*
 
          return this.logIn({ Username: credentials.email, password: credentials.password }).pipe(
            map((userData: any) => {
               console.log(userData);
               return userData
          //    return new LogInSuccess({ UserId: userData.user.UserId, token: userData.token, email: payload.email, role: userData.user.role });
            }),
            catchError((error: any) => {
              console.log(error);
                return EMPTY; // Completes the stream cleanly
           //   return of(new LogInFailure({ error: error }));
            })
          );

*/

    // Simulated Mock API response
    const mockResponse: AuthResponse = {
      accessToken: 'mock_access_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 60000,
      user: {
        username: 'xyz@exmaple.com',
        id: 'usr_99',
        email: credentials.email,
    //    firstName: credentials.email.split('@')[0],
        role: credentials.email.includes('admin') ? 'Admin' : 'User',
     
      }
    };
    
    return of(mockResponse).pipe(
      delay(800), // simulate network lag
      tap(res => this.handleAuthentication(res))
    );
  }

  // logIn(email: string, password: string): Observable<any> {
  login2(credentials: any): Observable<any> {
  //  console.log('auth.Login()');
    //  let data: any = {};
    const data = credentials;
    this.cId = this.tenantService.cId() 
    data.cId = this.cId;
/*
Notice LogIn$ passes Username (capital U), while AuthService reads credentials.username (lowercase u). 
*/

    data.email = credentials.username;
    const url = `${this.BASE_URL}/public/admin/login`; // '/public/admin/login
    //  const username = email;

    //  console.log('cId = ' + this.cId);
    //  const data = { username, email, password, cId: this.cId };

    //  data.username = credentials.email;
    //  data.password = credentials.password;
    //  data.InSessionReauthenticate = credentials.InSessionReauthenticate || false;
    // console.log(data);
    return this.http.post<User>(url, { userValues: data }); // .post('/login') 
  }






  refreshToken(): Observable<string | null> {
    const currentRefresh = localStorage.getItem('refresh_token');
    if (!currentRefresh) return of(null);

    const newAccessToken = 'mock_renewed_access_jwt_' + Date.now();
    localStorage.setItem('access_token', newAccessToken);
    this.accessToken = newAccessToken;
    this.updateLastActivityTimestamp();
    return of(newAccessToken).pipe(delay(400));
  }

  loginWithPropagatedTokens(): void {
    this.accessToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
      this.router.navigate(['/app/status']);
    }
  }

  logout(isCrossTabEviction = false): void {
    this.accessToken = null;
    if (!isCrossTabEviction) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('last_activity_timestamp');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }    

  private listenToCrossTabEvents(): void {
    window.addEventListener('storage', (event) => {
      if (event.key !== 'user_profile') return;
      this.ngZone.run(() => {
        if (event.newValue === null) {
          this.logout(true);
        } else if (event.newValue && !this.isAuthenticated()) {
          this.loginWithPropagatedTokens();
        }
      });
    });
  }

 

  /**
   * Process and save updated tokens & user profiles
   */
  private handleAuthentication(user: any): void {

    console.log('handleAuthentication')

        //    console.log('LogInSuccess, localStorage used * 4, refactor?');
       console.log(user);
          localStorage.setItem('accessToken', user.token); // the refreshToken is a separate cookie
          localStorage.setItem('currentUser', user.email);
          localStorage.setItem('role', user.role);
          localStorage.setItem('UserId', user.UserId);

            // Update the signal value to trigger UI rerenders where bound
            delete user.token
    this.currentUser.set(user);

          if (user.role === "checkin") {
            /*
            this was 2025 wip to allow staff not at hq handle event logins,
            not completed, also feature to allow attendees register on the day themselves also wip
            never deployed these, as the heat when off
            */
            this.router.navigateByUrl('/secure/checkin'); // 20250828 restricted user
          }
          else {
            this.router.navigateByUrl('/secure/status'); // normal admin
          }


return
/*
    this.accessToken = response.accessToken;
    
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_profile', JSON.stringify(response.user));

    // Update the signal value to trigger UI rerenders where bound
    this.currentUser.set(response.user);
    */
  }
 
  /**
   * Helper to hydrate the signal on page refreshes
   */
  private initializeUserFromStorage(): UserProfile | null {
    const storedUser = localStorage.getItem('user_profile');
    if (!storedUser) return null;
    
    try {
      return JSON.parse(storedUser) as UserProfile;
    } catch {
      return null;
    }
  }

    // Handy runtime helper for testing responsive menu flags directly on screen canvases
  toggleAuthenticationState() {
    if (this.isAuthenticated()) {
      this.logout();
    } else {
      this.simulateMockLogin();
    }
  }

  simulateMockLogin22() {
    console.log('simulateMockLogin()')
    this.tokenSignal.set('mock-jwt-token-string');
    this.currentUserSignal.set({
      id: 'USR-7721',
      username: 'rlacey',
      email: 'rlacey@system-node.internal',
      role: 'Admin'
    });
   this.router.navigate(['/status']);
  }


    simulateMockLogin() {
    console.log('simulateMockLogin()')

    const testUser = {
      id: 'USR-7721',
      username: 'rlacey',
      email: 'rlacey@system-node.internal',
      role: 'Admin'
    }

      this.tokenSignal.set('mock-jwt-token-string');
    this.login(testUser)


  
/*
    this.currentUserSignal.set({
      id: 'USR-7721',
      username: 'rlacey',
      email: 'rlacey@system-node.internal',
      role: 'Admin'
    });
    */
  // this.router.navigate(['/status']);    
  }

 
}
