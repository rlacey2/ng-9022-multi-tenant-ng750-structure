export type NavVisibility = 'always' | 'publicOnly' | 'authenticatedOnly';


export interface AppNavigationLink {
  label: string;
  path: string;
  visibility: NavVisibility;
}