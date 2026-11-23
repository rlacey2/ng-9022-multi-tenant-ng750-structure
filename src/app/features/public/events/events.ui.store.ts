import { computed, Injectable, signal } from '@angular/core';


export interface EventListItem {
  eventId: string;
  [key: string]: unknown;
}



@Injectable() // No providedIn: 'root' -> scoped to the component tree
export class EventUiStore {
  // Independent granular signals 

 readonly eventId = signal('-1');
 
  // 1. Store only the source of truth
  readonly eventsList = signal<EventListItem[]>([]);
  // 2. Derive the length automatically
  readonly eventsListLength = computed(() => this.eventsList().length);

  readonly eventOffset = signal(-1);
 

  readonly showChoices = signal(false);
  readonly paymentIntent = signal<{ id: string | null; amount: number }>({
    id: null,
    amount: -1,
  });

  readonly hideSelection = signal(false);
  readonly eventsEnabledToPublic = signal(false);
  readonly eventsAvailable = signal(false);






  // Nested hierarchy state (or split this into its own store if large!)
  readonly t3_meta = signal<any>({});

  // Derived UI state using computed()
  readonly isSubmitDisabled = computed(
    () => this.eventsListLength() <= 0 || !this.paymentIntent().id
  );

  readonly submitButtonText = computed(() => {
    const amount = this.paymentIntent().amount;
    return amount > 0 ? `Pay €${amount}` : 'Continue';
  });
}