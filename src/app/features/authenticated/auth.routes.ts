import { Routes, UrlSegment, UrlMatchResult, UrlMatcher } from '@angular/router';

function pathMatcher(path: string, segments: UrlSegment[]): UrlMatchResult | null {
  return segments.length > 0 && segments[0].path === path
    ? { consumed: [segments[0]], posParams: {} }
    : null;
}

export const statusMatcher: UrlMatcher = (segments) => pathMatcher('status', segments);
export const draftMatcher: UrlMatcher = (segments) => pathMatcher('draft', segments);
export const signinMatcher: UrlMatcher = (segments) => pathMatcher('signin', segments);
export const checkinMatcher: UrlMatcher = (segments) => pathMatcher('checkin', segments);
 
export const adminMatcher: UrlMatcher = (segments) => pathMatcher('admin', segments);


export const cmsMatcher: UrlMatcher = (segments: UrlSegment[]) => {
 console.log('ddddd')
  // Check the first segment (index 0)
  if (segments[0]?.path !== 'cms') {
    return null;
  }

  // Case 1: /cms
  if (segments.length === 1) {
    return { consumed: segments };
  }

  // Case 2: /cms/123 (binds index 1 to eventId)
  if (segments.length === 2) {
    return {
      consumed: segments,
      posParams: { eventId: segments[1] },
    };
  }

  return null;
};




export const AUTH_ROUTES: Routes = [
  {
    path: '', 
    children: [
      { matcher: statusMatcher, title: 'Status', loadComponent: () => import('./status/status').then(m => m.StatusComponent) },
      { matcher: adminMatcher, title: 'Admin', loadComponent: () => import('./admin/admin').then(m => m.AdminComponent) },
      { matcher: cmsMatcher, title: 'CMS', loadComponent: () => import('./cms/cms').then(m => m.CmsComponent) },
      { matcher: draftMatcher, title: 'Draft', loadComponent: () => import('./draft/draft').then(m => m.DraftComponent) },
      { matcher: signinMatcher, title: 'Signin', loadComponent: () => import('./signin/signin').then(m => m.SignInComponent) },
      { matcher: checkinMatcher, title: 'CheckIn', loadComponent: () => import('./signincheckin/signincheckin').then(m => m.SignInCheckInComponent) },
      { path: 'tests', title: 'Tests', loadComponent: () => import('./tests/tests').then(m => m.TestsComponent) },
      { path: 'useraccount', title: 'User Account', loadComponent: () => import('./useraccount/useraccount').then(m => m.UserAccountComponent) },
      { path: 'dbtasks/:eventId', title: 'DBTasks', loadComponent: () => import('./dbtasks/dbtasks').then(m => m.DBtasksComponent) },
      {
        path: 'dbtasks',
        title: 'DBTasks Root',
        children: [
          { path: '**', loadComponent: () => import('./dbtasks/dbtasks').then(m => m.DBtasksComponent) }
        ]
      }
    ]
  }
];
