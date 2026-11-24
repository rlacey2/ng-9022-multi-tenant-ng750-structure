import { computed, Injectable, signal } from '@angular/core';

@Injectable() // No providedIn: 'root' -> scoped to the component tree
export class T3UiStore {

  // Nested hierarchy state (or split this into its own store if large!)

  readonly eventIdUnavailable = signal<boolean>(false); // is this needed now

  readonly ec: any = signal<object>({});

}