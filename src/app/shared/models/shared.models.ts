export type NavVisibility = 'always' | 'publicOnly' | 'authenticatedOnly';


export interface AppNavigationLink {
  label: string;
  path: string;
  visibility: NavVisibility;
}



export interface EventConfigurationModel {
  eventId: number | null;
  name: string;
  [key: string]: unknown; // Allows any additional properties
}